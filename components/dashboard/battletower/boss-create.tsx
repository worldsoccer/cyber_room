"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function BossCreatePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [bossName, setBossName] = useState<string>("");
  const [bossDescription, setBossDescription] = useState<string>("");
  const [maxHp, setMaxHp] = useState<number>(100);
  const [attackPower, setAttackPower] = useState<number>(10);
  const [attackTurn, setAttackTurn] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<number>(1); // 推奨レベル
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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    setIsSaving(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      formData.append("name", bossName);
      formData.append("description", bossDescription);
      formData.append("maxHp", String(maxHp));
      formData.append("attackPower", String(attackPower));
      formData.append("attackTurn", String(attackTurn));
      formData.append("difficulty", String(difficulty)); // 推奨レベルを送信

      const response = await fetch("/api/boss", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("ボスの登録に失敗しました");
      }

      const data = await response.json();
      toast({ description: "ボスが正常に登録されました！" });
      router.push(`/newboss/${data.bossId}`);
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
    <form
      onSubmit={onSubmit}
      className="space-y-8 max-w-2xl mx-auto mt-8 p-6 border rounded-lg bg-white shadow-md"
    >
      {/* 戻るボタン */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded"
      >
        戻る
      </button>
      <h1 className="text-2xl font-bold">新しいボスを作成</h1>

      {/* 名前入力 */}
      <div>
        <label className="block mb-2 font-medium">ボスの名前:</label>
        <input
          type="text"
          value={bossName}
          onChange={(e) => setBossName(e.target.value)}
          placeholder="例: ダークドラゴン"
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      {/* 説明入力 */}
      <div>
        <label className="block mb-2 font-medium">ボスの説明:</label>
        <textarea
          value={bossDescription}
          onChange={(e) => setBossDescription(e.target.value)}
          placeholder="例: 恐ろしいドラゴン。火を吹く。"
          rows={3}
          className="w-full border p-2 rounded-md"
        />
      </div>

      {/* 画像アップロード */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-4 text-center cursor-pointer rounded-md"
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <p>{selectedImage.name}</p>
        ) : (
          <p>画像をドラッグ＆ドロップ、またはクリックしてアップロード</p>
        )}
      </div>

      {/* 最大HP入力 */}
      <div>
        <label className="block mb-2 font-medium">最大HP:</label>
        <input
          type="number"
          value={maxHp}
          onChange={(e) => setMaxHp(Number(e.target.value))}
          className="w-full border p-2 rounded-md"
          min={1}
          required
        />
      </div>

      {/* 攻撃力入力 */}
      <div>
        <label className="block mb-2 font-medium">攻撃力:</label>
        <input
          type="number"
          value={attackPower}
          onChange={(e) => setAttackPower(Number(e.target.value))}
          className="w-full border p-2 rounded-md"
          min={1}
          required
        />
      </div>

      {/* 攻撃ターン入力 */}
      <div>
        <label className="block mb-2 font-medium">攻撃ターン:</label>
        <input
          type="number"
          value={attackTurn}
          onChange={(e) => setAttackTurn(Number(e.target.value))}
          className="w-full border p-2 rounded-md"
          min={1}
          required
        />
      </div>

      {/* 難易度入力 */}
      <div>
        <label className="block mb-2 font-medium">難易度:</label>
        <input
          type="number"
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      {/* 保存ボタン */}
      <button
        type="submit"
        className={cn(buttonVariants(), "w-full")}
        disabled={isSaving || !bossName.trim()}
      >
        {isSaving ? "保存中..." : "ボスを保存"}
      </button>
    </form>
  );
}
