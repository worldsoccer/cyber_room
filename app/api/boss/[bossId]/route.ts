import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// URL パラメータのスキーマを定義
const routeContextSchema = z.object({
  params: z.object({
    bossId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: { params: Promise<{ bossId: string }> }
) {
  const resolvedParams = await context.params; // 非同期でパラメータを解決
  const { params } = routeContextSchema.parse({ params: resolvedParams }); // パラメータを検証
  const bossId = parseInt(params.bossId, 10); // bossId を数値型に変換

  if (isNaN(bossId)) {
    return NextResponse.json({ error: "ボスIDが無効です。" }, { status: 400 });
  }

  try {
    // ボス情報を取得
    const boss = await db.boss.findUnique({
      where: { id: bossId },
    });

    if (!boss) {
      return NextResponse.json(
        { error: "ボスが見つかりませんでした。" },
        { status: 404 }
      );
    }

    return NextResponse.json(boss, { status: 200 });
  } catch (error) {
    console.error("エラー:", error);
    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
