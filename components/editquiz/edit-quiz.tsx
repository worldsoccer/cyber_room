"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  text: string;
}

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  difficulty: number;
  feedback?: Feedback;
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
  questions: Question[];
}

interface EditQuizProps {
  quizId: number;
}

export default function EditQuiz({ quizId }: EditQuizProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // クイズデータを取得
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (!res.ok) {
          throw new Error("クイズデータの取得に失敗しました。");
        }
        const data: Quiz = await res.json(); // 明確な型を指定
        setQuiz(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast({
            title: "エラー",
            description:
              error.message || "データの読み込み中にエラーが発生しました。",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, [quizId, toast]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (!quiz) {
    return <p>クイズが見つかりませんでした。</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">クイズ編集</h1>

      {/* クイズ情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">クイズ情報</h2>
        <p>
          <strong>タイトル:</strong> {quiz.title}
        </p>
        <p>
          <strong>説明:</strong> {quiz.description}
        </p>
        {quiz.imagePath ? (
          <div>
            <strong>画像:</strong>
            <Image
              src={quiz.imagePath || "/default-placeholder.png"}
              alt={quiz.title}
              width={500}
              height={300}
              className="w-full max-w-md mt-2 rounded"
            />
          </div>
        ) : (
          <p>画像はありません。</p>
        )}
      </div>

      {/* 質問リスト */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">質問</h2>
        {quiz.questions.map((question, questionIndex) => (
          <div key={question.id} className="border p-4 rounded space-y-2">
            <p>
              <strong>質問 {questionIndex + 1}:</strong> {question.text}
            </p>
            <p>
              <strong>難易度:</strong> {question.difficulty}
            </p>
            <p>
              <strong>解説:</strong> {question.feedback?.text || "なし"}
            </p>
            <div>
              <strong>選択肢:</strong>
              <ul className="list-disc ml-5 mt-1">
                {question.options.map((option, optionIndex) => (
                  <li
                    key={option.id}
                    className={option.isCorrect ? "text-green-600" : ""}
                  >
                    {optionIndex + 1}. {option.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
