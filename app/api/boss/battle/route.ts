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

    const { quizIds, difficulty } = await request.json();

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
        id: { in: quizIds },
      },
      include: {
        questions: {
          include: {
            options: true,
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

    // ユーザー情報を取得
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // レベルに基づいて取得するボスの数を決定
    const bossCount = Math.floor(user.level / 10) + 1;

    // 指定された難易度以下のボスを取得
    const allBosses = await db.boss.findMany({
      where: { difficulty: { lte: difficulty } },
    });

    if (allBosses.length === 0) {
      return NextResponse.json(
        { error: "No bosses found for the provided difficulty" },
        { status: 404 }
      );
    }

    // 必ず1体は指定された難易度のボスを含める
    const matchingDifficultyBosses = await db.boss.findMany({
      where: { difficulty },
    });

    if (matchingDifficultyBosses.length === 0) {
      return NextResponse.json(
        { error: "No bosses found for the exact difficulty" },
        { status: 404 }
      );
    }

    const selectedBosses: typeof allBosses = [];

    // 難易度一致のボスを1体追加
    selectedBosses.push(
      matchingDifficultyBosses[
        Math.floor(Math.random() * matchingDifficultyBosses.length)
      ]
    );

    // 残りのボスをランダムに追加
    const remainingBosses = allBosses.filter(
      (boss) => !selectedBosses.some((selected) => selected.id === boss.id)
    );

    while (selectedBosses.length < bossCount && remainingBosses.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingBosses.length);
      selectedBosses.push(remainingBosses[randomIndex]);
      remainingBosses.splice(randomIndex, 1);
    }

    // ボス情報とクイズ情報を一緒に返す
    return NextResponse.json({
      bosses: selectedBosses,
      quizzes,
      user: {
        hp: user.hp,
        maxHp: user.maxHp,
        experience: user.experience,
        level: user.level,
        attackPower: user.attackPower,
        healingPower: user.healingPower,
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
