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

interface ParsedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
  explanation: string | null;
}

export default function NewQuiz({ fileId }: NewQuizProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [quizInput, setQuizInput] = useState<string>(""); // 質問、選択肢、答えの一括入力用
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const parseQuizInput = (input: string): ParsedQuestion[] => {
    const questions = input
      .split(/問題\d+:/) // 各問題を分割
      .filter(Boolean) // 空の要素を除外
      .map((block, index): ParsedQuestion => {
        try {
          // 質問の抽出
          const questionMatch = block.match(/^(.*?)(\n|$)/);
          const question = questionMatch ? questionMatch[1].trim() : "";

          // 選択肢の抽出 (空行を無視)
          const lines = block.split("\n").map((line) => line.trim()); // 各行をトリム
          const options = lines
            .slice(1) // 最初の行 (質問) を除外
            .filter(
              (line) =>
                line && // 空行を無視
                !line.startsWith("正解:") &&
                !line.startsWith("難易度:") &&
                !line.startsWith("解説:")
            );

          // 正解、難易度、解説の抽出
          const correctAnswerMatch = block.match(/正解:\s*(\d+)/);
          const difficultyMatch = block.match(/難易度:\s*(\d+)/);
          const explanationMatch = block.match(/解説:\s*(.*)/s);

          const correctAnswer = correctAnswerMatch
            ? parseInt(correctAnswerMatch[1], 10)
            : -1;
          const difficulty = difficultyMatch
            ? parseInt(difficultyMatch[1], 10)
            : -1;
          const explanation = explanationMatch
            ? explanationMatch[1].trim()
            : null;

          // バリデーション
          if (
            !question || // 質問が空の場合
            options.length < 4 || // 選択肢が4つ未満の場合
            correctAnswer < 1 || // 正解が不正
            difficulty < 1 // 難易度が不正
          ) {
            throw new Error(`質問 ${index + 1} のフォーマットが不正です。`);
          }

          return { question, options, correctAnswer, difficulty, explanation };
        } catch (err: unknown) {
          if (err instanceof Error) {
            throw new Error(
              `質問 ${index + 1} の解析中にエラーが発生しました: ${err.message}`
            );
          }
          throw new Error(
            `質問 ${index + 1} の解析中に予期しないエラーが発生しました。`
          );
        }
      });

    return questions;
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedImage) {
      const userConfirmed = window.confirm(
        "画像がアップロードされていません。このまま保存を続けますか？"
      );
      if (!userConfirmed) {
        return; // 処理を中断して戻る
      }
    }

    setIsSaving(true);

    try {
      const parsedQuestions = parseQuizInput(quizInput);
      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      formData.append("title", quizTitle);
      formData.append("description", quizDescription);
      formData.append("fileId", String(fileId));
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "エラー",
          description: error.message || "入力形式を確認してください。",
          variant: "destructive",
        });
      } else {
        toast({
          title: "エラー",
          description: "予期しないエラーが発生しました。",
          variant: "destructive",
        });
      }
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
