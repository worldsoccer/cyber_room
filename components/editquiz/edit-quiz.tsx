"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EditQuizProps {
  quizId: number;
}

export default function EditQuiz({ quizId }: EditQuizProps) {
  const [quiz, setQuiz] = useState<any>(null);
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
        const data = await res.json();
        setQuiz(data);
      } catch (error: any) {
        toast({
          title: "エラー",
          description:
            error.message || "データの読み込み中にエラーが発生しました。",
          variant: "destructive",
        });
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
        {quiz.imagePath ? ( // 画像が存在する場合にのみ表示
          <div>
            <strong>画像:</strong>
            {/* <div>{quiz.imagePath}</div> */}

            <img
              // src={
              //   "https://nzmqqrivmefdpxpqunoq.supabase.co/storage/v1/object/public/public-img-bucket/uploads/1732495778968_.png"
              // }
              src={quiz.imagePath}
              alt={quiz.title}
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
        {quiz.questions.map((question: any, questionIndex: number) => (
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
                {question.options.map((option: any, optionIndex: number) => (
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
