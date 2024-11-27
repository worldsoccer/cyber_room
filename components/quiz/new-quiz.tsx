"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface NewQuizProps {
  fileId: number; // fileId を受け取る
}

export default function NewQuiz({ fileId }: NewQuizProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [quizInput, setQuizInput] = useState<string>(""); // 質問、選択肢、答えの一括入力用
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  // ドラッグアンドドロップによる画像アップロード
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      toast({ description: "画像がアップロードされました！" });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // クイズフォーマットのパース処理
  const parseQuizInput = (input: string) => {
    // 問題ごとに分割
    const questions = input
      .split(/問題\d+:/)
      .filter(Boolean)
      .map((block, index) => {
        try {
          // 選択肢やその他のデータを正規表現で抽出
          const questionMatch = block.match(/^(.*?)(?=\d+\.\s|正解:)/s);
          const optionsMatch = block.match(
            /(\d+\.\s.*?)(?=(\d+\.\s|正解:|$))/gs
          );
          const correctAnswerMatch = block.match(/正解:\s*(\d+)/);
          const difficultyMatch = block.match(/難易度:\s*(\d+)/);
          const explanationMatch = block.match(/解説:\s*(.*)/s);

          // 質問文
          const question = questionMatch ? questionMatch[1].trim() : null;

          // 選択肢
          const options = optionsMatch
            ? optionsMatch.map((opt) => opt.replace(/^\d+\.\s*/, "").trim())
            : [];

          // 正解、難易度、解説を取得
          const correctAnswer = correctAnswerMatch
            ? parseInt(correctAnswerMatch[1], 10)
            : null;
          const difficulty = difficultyMatch
            ? parseInt(difficultyMatch[1], 10)
            : null;
          const explanation = explanationMatch
            ? explanationMatch[1].trim()
            : null;

          if (
            !question ||
            options.length < 4 ||
            correctAnswer === null ||
            !difficulty
          ) {
            throw new Error(`質問 ${index + 1} のフォーマットが不正です。`);
          }

          return { question, options, correctAnswer, difficulty, explanation };
        } catch (error: any) {
          throw new Error(
            `質問 ${index + 1} の解析中にエラーが発生しました: ${error.message}`
          );
        }
      });

    return questions;
  };

  // フォーム送信時の処理
  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const parsedQuestions = parseQuizInput(quizInput);
      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      formData.append("title", quizTitle); // タイトルを追加
      formData.append("description", quizDescription); // 説明を追加
      formData.append("fileId", String(fileId)); // fileId を追加
      formData.append("questions", JSON.stringify(parsedQuestions));

      const response = await fetch("/api/quiz", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("クイズの登録に失敗しました");
      }

      const data = await response.json();
      toast({ description: "クイズが正常に登録されました！" });
      router.push(`/editquiz/${data.quizId}`);
    } catch (error) {
      toast({
        title: "エラー",
        description: "入力形式を確認してください。",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <h1 className="text-2xl font-bold">クイズを作成</h1>

      {/* タイトル入力 */}
      <div>
        <label className="block mb-2 font-medium">クイズのタイトル:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="例: チューリングテストの概要"
          className="w-full border p-2"
        />
      </div>

      {/* 説明入力 */}
      <div>
        <label className="block mb-2 font-medium">クイズの説明:</label>
        <textarea
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          placeholder="例: このクイズでは、チューリングテストとその意義について学びます。"
          rows={3}
          className="w-full border p-2"
        />
      </div>

      {/* 画像アップロード */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <p>{selectedImage.name}</p>
        ) : (
          <p>画像をドラッグ＆ドロップ、またはクリックしてアップロード</p>
        )}
      </div>

      {/* クイズ入力 */}
      <div>
        <label className="block mb-2 font-medium">クイズ内容を入力:</label>
        <textarea
          value={quizInput}
          onChange={(e) => setQuizInput(e.target.value)}
          placeholder={`例:
クイズ1: チューリングテストの概要
1. オプション1
2. オプション2
3. オプション3
4. オプション4
正解: 2
難易度: 3
解説: チューリングテストとは...`}
          rows={10}
          className="w-full border p-2"
        />
      </div>

      {/* 保存ボタン */}
      <button
        type="submit"
        className={cn(buttonVariants())}
        disabled={isSaving || !quizInput.trim() || !quizTitle.trim()}
      >
        {isSaving ? "保存中..." : "クイズを保存"}
      </button>
    </form>
  );
}
