import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import battleConfig from "@/config/battle"; // 設定ファイルをインポート

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { experienceGained } = body; // 経験値増減（正の値 or 負の値）
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

    // 経験値が0未満にならないよう制御
    if (updatedExperience < 0) {
      updatedExperience = 0;
    }

    const levelUpThreshold = user.level * battleConfig.levelUpMultiplier; // レベルアップに必要な経験値

    // レベルアップ・ダウンの判定
    let newLevel = user.level;
    let remainingExperience = updatedExperience;

    if (updatedExperience >= levelUpThreshold) {
      // レベルアップ
      newLevel = user.level + 1;
      remainingExperience = updatedExperience - levelUpThreshold;
    } else if (
      experienceGained < 0 &&
      updatedExperience < user.level * battleConfig.levelUpMultiplier
    ) {
      // レベルダウン（必要なら追加）
      newLevel = Math.max(1, user.level - 1); // レベル1以下にならないようにする
      remainingExperience = updatedExperience; // 必要に応じて再計算
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

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
