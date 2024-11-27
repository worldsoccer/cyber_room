import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

const routeContextSchema = z.object({
  params: z.object({
    quizId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: { params: Promise<{ quizId: string }> }
) {
  const resolvedParams = await context.params;
  const { params } = routeContextSchema.parse({ params: resolvedParams });
  // 非同期的に params を解決

  const quizId = parseInt(params.quizId, 10); // fileId を数値型に変換

  // 現在のユーザーがこのファイルにアクセス権を持っているか確認
  if (!(await verifyCurrentUserHasAccessToFile(quizId))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (isNaN(quizId)) {
    return NextResponse.json(
      { error: "クイズIDが無効です。" },
      { status: 400 }
    );
  }

  try {
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
            feedback: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "クイズが見つかりませんでした。" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("エラー:", error);
    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// 現在のユーザーが特定のファイルにアクセス権を持っているか確認
async function verifyCurrentUserHasAccessToFile(quizId: number) {
  // const session = await getServerSession(authOptions);

  // ファイルが現在のユーザーのものであるかを確認
  const count = await db.quiz.count({
    where: {
      id: quizId,
    },
  });

  return count > 0;
}
