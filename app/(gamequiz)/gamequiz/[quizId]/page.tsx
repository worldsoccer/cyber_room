"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 型の定義
interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  imagePath?: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  feedback: { text: string };
}

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

// 配列をシャッフルするユーティリティ関数
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export default function GameQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const router = useRouter();
  const [quizId, setQuizId] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setQuizId(parseInt(resolvedParams.quizId, 10));
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (quizId === null) return;

    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        // 統一された API パスを使用
        const res = await fetch(`/api/quiz/${quizId}`);
        if (!res.ok) {
          throw new Error("クイズデータの取得に失敗しました。");
        }
        const data: Quiz = await res.json();

        // 質問をシャッフルして設定
        const shuffledQuestions = shuffleArray(data.questions);
        setQuiz({ ...data, questions: shuffledQuestions });

        // 最初の質問の選択肢をシャッフル
        if (shuffledQuestions.length > 0) {
          setShuffledOptions(shuffleArray(shuffledQuestions[0].options));
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "データの取得中にエラーが発生しました。");
        } else {
          setError("データの取得中に未知のエラーが発生しました。");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz && currentQuestionIndex < quiz.questions.length) {
      const currentOptions = quiz.questions[currentQuestionIndex].options;
      setShuffledOptions(shuffleArray(currentOptions));
      setShowImage(false);
    }
  }, [quiz, currentQuestionIndex]);

  if (isLoading) return <p className="text-center mt-8">読み込み中...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-8">エラー: {error}</p>;
  if (!quiz)
    return <p className="text-center mt-8">クイズデータが見つかりません。</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (optionId: number) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    setShowImage(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const toggleShowImage = () => {
    setShowImage((prev) => !prev);
  };

  return (
    <div className="quiz-game max-w-2xl mx-auto mt-10 p-4 border rounded shadow-lg">
      {/* クイズタイトル */}
      <h1 className="text-2xl font-bold text-center mb-6">{quiz.title}</h1>

      {/* 現在の質問 */}
      {currentQuestion ? (
        <div className="question">
          <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>

          {/* 選択肢 */}
          <ul className="options-list grid gap-4">
            {shuffledOptions.map((option, index) => (
              <li
                key={option.id}
                className={`border p-3 rounded cursor-pointer hover:bg-gray-200 ${
                  selectedOption === option.id ? "bg-blue-100" : ""
                }`}
                onClick={() => handleOptionClick(option.id)}
              >
                <span className="font-semibold mr-2">{index + 1}.</span>
                {option.text}
              </li>
            ))}
          </ul>

          {/* 画像表示切り替えボタン */}
          {!showFeedback && (
            <button
              onClick={toggleShowImage}
              className="mt-6 py-2 px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {showImage ? "画像を隠す" : "画像を表示する"}
            </button>
          )}

          {/* 画像表示 */}
          {showImage && quiz.imagePath && (
            <Image
              src={quiz.imagePath || "/default-placeholder.png"}
              alt="質問画像"
              width={500}
              height={300}
              className="w-full max-w-md mt-4 rounded shadow"
            />
          )}

          {showFeedback && (
            <div className="feedback mt-6">
              {/* 正解/不正解メッセージ */}
              <p
                className={`text-lg font-bold ${
                  shuffledOptions.find((opt) => opt.id === selectedOption)
                    ?.isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {shuffledOptions.find((opt) => opt.id === selectedOption)
                  ?.isCorrect
                  ? "正解です！"
                  : "不正解です。"}
              </p>

              {/* 解説の表示 */}
              <p className="mt-4 text-gray-700">
                {currentQuestion.feedback.text}
              </p>

              {/* 次の質問に進むボタン */}
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 py-2 px-4 border rounded bg-green-500 text-white hover:bg-green-600"
                >
                  次の質問
                </button>
              ) : (
                <div className="mt-6">
                  <p className="text-lg font-semibold">クイズ終了です！</p>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-4 py-2 px-4 border rounded bg-gray-500 text-white hover:bg-gray-600"
                  >
                    戻る
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>クイズが終了しました。</p>
      )}
    </div>
  );
}
