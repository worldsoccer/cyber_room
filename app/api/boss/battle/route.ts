import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // リクエストボディから選択されたクイズ ID と難易度を取得
    const { quizIds, difficulty, selectedFloorLevel } = await request.json();

    if (!Array.isArray(quizIds) || quizIds.length === 0) {
      return NextResponse.json(
        { error: "Quiz IDs are required" },
        { status: 400 }
      );
    }

    if (!difficulty) {
      return NextResponse.json(
        { error: "Difficulty is required" },
        { status: 400 }
      );
    }

    // クイズ情報を取得
    const quizzes = await db.quiz.findMany({
      where: {
        id: { in: quizIds }, // 選択されたクイズ ID に一致するものを取得
      },
      include: {
        questions: {
          include: {
            options: true, // 各質問の選択肢も取得
            feedback: true,
          },
        },
      },
    });

    if (quizzes.length === 0) {
      return NextResponse.json(
        { error: "No quizzes found for the provided IDs" },
        { status: 404 }
      );
    }

    // 難易度に基づいてボス情報を取得
    const bosses = await db.boss.findMany({
      where: { difficulty },
    });

    if (bosses.length === 0) {
      return NextResponse.json(
        { error: "No bosses found for the provided difficulty" },
        { status: 404 }
      );
    }

    // ランダムでボスを選択
    const allBosses = await db.boss.findMany({ where: { difficulty } });
    const selectedBosses = Array.from(
      { length: selectedFloorLevel },
      () => allBosses[Math.floor(Math.random() * allBosses.length)]
    );

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        hp: true,
        maxHp: true,
        experience: true,
        level: true,
        attackPower: true,
        healingPower: true,
      },
    });

    // ボス情報とクイズ情報を一緒に返す
    return NextResponse.json({
      bosses: selectedBosses,
      quizzes,
      user: {
        hp: user?.hp,
        maxHp: user?.maxHp,
        experience: user?.experience,
        level: user?.level,
        attackPower: user?.attackPower,
        healingPower: user?.healingPower,
      },
    });
  } catch (error) {
    console.error("Failed to fetch battle data:", error);
    return NextResponse.json(
      { error: "Failed to fetch battle data" },
      { status: 500 }
    );
  }
}
