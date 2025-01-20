import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import battleConfig from "@/config/battle";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { experienceGained } = body;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const userId = session.user.id;

    // ユーザー情報を取得
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 現在の経験値を計算
    let updatedExperience = user.experience + experienceGained;
    let newLevel = user.level;

    // 経験値が0未満にならないよう制御
    if (updatedExperience < 0) {
      updatedExperience = 0;
    }

    let remainingExperience = updatedExperience;

    // レベルアップ処理
    while (remainingExperience >= newLevel * battleConfig.levelUpMultiplier) {
      remainingExperience -= newLevel * battleConfig.levelUpMultiplier;
      newLevel += 1;
    }

    // レベルダウン処理
    while (
      newLevel > 1 &&
      remainingExperience < (newLevel - 1) * battleConfig.levelUpMultiplier
    ) {
      const levelDownThreshold =
        (newLevel - 1) * battleConfig.levelUpMultiplier;

      newLevel -= 1; // レベルダウン
      remainingExperience += levelDownThreshold;
    }

    // ユーザー情報を更新
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        experience: remainingExperience,
        level: newLevel,
        hp:
          user.maxHp +
          (newLevel - user.level) * battleConfig.hpIncreasePerLevel,
        maxHp:
          user.maxHp +
          (newLevel - user.level) * battleConfig.hpIncreasePerLevel,
        attackPower:
          user.attackPower +
          (newLevel - user.level) * battleConfig.attackPowerIncreasePerLevel,
        healingPower:
          user.healingPower +
          (newLevel - user.level) * battleConfig.healingPowerIncreasePerLevel,
      },
    });

    console.log(`Final: Experience=${remainingExperience}, Level=${newLevel}`);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
