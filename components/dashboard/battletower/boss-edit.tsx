"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Boss {
  id: number;
  name: string;
  description: string;
  maxHp: number;
  hp: number;
  attackPower: number;
  attackTurn: number;
  difficulty: number;
  imageUrl?: string;
}

interface EditBossProps {
  bossId: number;
}

export default function BossEdit({ bossId }: EditBossProps) {
  const [boss, setBoss] = useState<Boss | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // ボスデータを取得
    async function fetchBoss() {
      try {
        const res = await fetch(`/api/boss/${bossId}`);
        if (!res.ok) {
          throw new Error("ボスデータの取得に失敗しました。");
        }
        const data: Boss = await res.json(); // 明確な型を指定
        setBoss(data);
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

    fetchBoss();
  }, [bossId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">読み込み中...</p>
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">ボスが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 戻るボタン */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded"
      >
        戻る
      </button>

      {/* タイトル */}
      <h1 className="text-3xl font-bold text-center">ボス編集</h1>

      {/* ボス情報 */}
      <div className="bg-white shadow rounded-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">ボス情報</h2>

        <div className="space-y-2">
          <p>
            <strong>名前:</strong> {boss.name}
          </p>
          <p>
            <strong>説明:</strong> {boss.description}
          </p>
          <p>
            <strong>最大HP:</strong> {boss.maxHp}
          </p>
          <p>
            <strong>現在のHP:</strong> {boss.hp}
          </p>
          <p>
            <strong>攻撃力:</strong> {boss.attackPower}
          </p>
          <p>
            <strong>攻撃ターン:</strong> {boss.attackTurn}
          </p>
          <p>
            <strong>難易度:</strong> {boss.difficulty}
          </p>
        </div>

        {/* ボス画像 */}
        {boss.imageUrl ? (
          <div className="mt-6 text-center">
            <Image
              src={boss.imageUrl || "/default-placeholder.png"}
              alt={boss.name}
              width={500}
              height={300}
              className="w-full max-w-md mx-auto rounded shadow"
            />
          </div>
        ) : (
          <div className="mt-6 text-center text-gray-500">
            <p>画像はありません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
