"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: number;
  title: string;
  imagePath?: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  feedback: Feedback;
  imagePath?: string;
}

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Feedback {
  id: number;
  text: string;
  questionId: number;
}

interface Result {
  question: string;
  isCorrect: boolean;
}

// 配列をランダム化するユーティリティ関数
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const GameTestPage = ({ params }: { params: Promise<{ fileId: string }> }) => {
  const [fileId, setFileId] = useState<number | null>(null);
  const [fileQuizzes, setFileQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [, setHasExplained] = useState(false);
  const [answered, setAnswered] = useState(false); // 回答済みかどうか
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.fileId, 10);
        if (isNaN(id)) {
          throw new Error("無効なファイル ID です。");
        }
        setFileId(id);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "エラーが発生しました。");
        } else {
          setError("予期しないエラーが発生しました。");
        }
      }
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchFileQuizzes = async () => {
      if (!fileId) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/files/${fileId}`);
        if (!res.ok) {
          throw new Error("クイズデータの取得に失敗しました。");
        }
        const data: Quiz[] = await res.json();

        const allQuestions = shuffleArray(
          data.flatMap((quiz) => quiz.questions)
        );
        setFileQuizzes(data);
        setQuestions(allQuestions);

        if (allQuestions.length > 0) {
          setShuffledOptions(shuffleArray(allQuestions[0].options));
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "エラーが発生しました。");
        } else {
          setError("予期しないエラーが発生しました。");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileQuizzes();
  }, [fileId]);

  useEffect(() => {
    // 質問が切り替わるたびに画像パスを更新
    setHasExplained(false);
    setAnswered(false); // 回答済みフラグをリセット
    setSelectedOption(null); // 選択済みオプションをリセット
    if (questions[currentQuestionIndex]) {
      setShuffledOptions(shuffleArray(questions[currentQuestionIndex].options));
    }
  }, [currentQuestionIndex, questions]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuizImagePath = fileQuizzes.find((quiz) =>
    quiz.questions.some((q) => q.id === currentQuestion?.id)
  )?.imagePath;

  const handleOptionSelect = (option: Option) => {
    if (answered) return; // 回答済みの場合は何もしない

    setAnswered(true); // 回答済みに設定

    if (option.isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setSelectedOption(option.id);

    setResults((prevResults) => [
      ...prevResults,
      {
        question: currentQuestion.text,
        isCorrect: option.isCorrect,
      },
    ]);

    setHasExplained(!showExplanation);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setIsTestFinished(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isTestFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">テスト終了</h1>
        <p className="text-xl">
          {questions.length}問中{correctAnswers}問正解しました！
        </p>
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold mb-4">結果一覧</h2>
          <ul className="list-disc pl-6">
            {results.map((result, index) => (
              <li
                key={index}
                className={`mb-2 ${
                  result.isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.question} - {result.isCorrect ? "正解" : "不正解"}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          戻る
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">クイズデータが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-xl font-bold mb-6">{currentQuestion.text}</h1>
      <ul className="space-y-4">
        {shuffledOptions.map((option) => (
          <li
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            className={`p-4 border rounded cursor-pointer ${
              selectedOption === null
                ? "hover:bg-gray-100"
                : option.id === selectedOption
                ? option.isCorrect
                  ? "bg-green-100"
                  : "bg-red-100"
                : ""
            }`}
          >
            {option.text}
          </li>
        ))}
      </ul>

      {selectedOption !== null && showExplanation && (
        <div className="mt-6">
          <p className="text-gray-700">{currentQuestion.feedback.text}</p>
          {currentQuizImagePath && (
            <Image
              src={currentQuizImagePath}
              alt="クイズ画像"
              width={500}
              height={300}
              className="mt-4 rounded shadow"
            />
          )}
        </div>
      )}

      <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          id="showExplanation"
          checked={showExplanation}
          onChange={(e) => setShowExplanation(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showExplanation">解答後に解説を表示</label>
      </div>

      {answered && (
        <button
          onClick={handleNextQuestion}
          className="mt-6 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          次の質問へ
        </button>
      )}
    </div>
  );
};

export default GameTestPage;
