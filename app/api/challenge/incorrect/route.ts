import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 認証セッションを取得
    const session = await getServerSession(authOptions);
    // console.log("1");

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { user } = session;
    const { questionId } = await req.json();

    if (!user.id || !questionId) {
      return NextResponse.json(
        { error: "ユーザーIDまたは質問IDが提供されていません。" },
        { status: 400 }
      );
    }

    // Prisma: 不正解のデータを記録
    await db.incorrectAnswer.create({
      data: {
        userId: user.id, // ユーザーID
        questionId: Number(questionId), // 質問IDをNumber型に変換
        answeredAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("不正解の記録エラー:", error);

    // Prismaエラーハンドリング
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "サーバーエラーが発生しました。" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "不明なエラーが発生しました。" },
      { status: 500 }
    );
  }
}
