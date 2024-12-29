import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { user } = session;
    const body = await req.json();

    // 必要なパラメータを取得
    const { folderId, mode, questionCount } = body;

    console.log("Request body:", body); // リクエストボディを確認

    // パラメータのバリデーション
    if (!folderId || !mode || !questionCount) {
      console.warn("Invalid payload:", body);
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // Prismaのupsert処理
    await db.gameProgress.upsert({
      where: {
        userId_folderId_mode: { userId: user.id, folderId, mode },
      },
      update: {
        clearCount: { increment: 1 },
        lastClearedAt: new Date(),
      },
      create: {
        userId: user.id,
        folderId,
        mode,
        totalQuestions: questionCount,
        clearCount: 1,
        lastClearedAt: new Date(),
      },
    });

    console.log("クリア情報が正常に保存されました。");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
