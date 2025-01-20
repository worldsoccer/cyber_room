import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import battleConfig from "@/config/battle"; // 設定ファイルをインポート

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

    const levelUpThreshold = user.level * battleConfig.levelUpMultiplier; // レベルアップに必要な経験値

    // レベルアップ・ダウンの判定
    let newLevel = user.level;
    let remainingExperience = updatedExperience;

    // レベルアップ処理
    if (updatedExperience >= levelUpThreshold) {
      while (updatedExperience >= newLevel * battleConfig.levelUpMultiplier) {
        updatedExperience -= newLevel * battleConfig.levelUpMultiplier;
        newLevel += 1; // レベルアップ
      }
      remainingExperience = updatedExperience;
    }

    // レベルダウン処理
    const levelDownThreshold = (newLevel - 1) * battleConfig.levelUpMultiplier;
    if (updatedExperience < levelDownThreshold) {
      while (
        newLevel > 1 &&
        updatedExperience < (newLevel - 1) * battleConfig.levelUpMultiplier
      ) {
        newLevel -= 1; // レベルダウン
        updatedExperience += newLevel * battleConfig.levelUpMultiplier;
      }
      remainingExperience = updatedExperience;
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
