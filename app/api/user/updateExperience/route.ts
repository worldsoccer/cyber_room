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

    // 初期化
    let totalExperience = user.experience + experienceGained; // 現在の経験値 + 獲得経験値
    let newLevel = user.level;
    let bonusIncrement = 0; // 特定レベル到達時の追加増加量

    // レベルアップ処理
    if (experienceGained > 0) {
      while (totalExperience >= newLevel * battleConfig.levelUpMultiplier) {
        const levelThreshold = newLevel * battleConfig.levelUpMultiplier;
        totalExperience -= levelThreshold; // 必要経験値を差し引く
        newLevel += 1; // レベルアップ

        // 特定レベル（5, 10, 15, ...）に到達した場合の処理
        if (newLevel % battleConfig.levelMilestone === 0) {
          bonusIncrement += battleConfig.iIncreasePerLevel; // 追加で+2
        }
      }
    }

    // レベルダウン処理
    if (experienceGained < 0) {
      while (
        newLevel > 1 &&
        totalExperience < (newLevel - 1) * battleConfig.levelUpMultiplier
      ) {
        newLevel -= 1; // レベルダウン
        const levelThreshold = newLevel * battleConfig.levelUpMultiplier;
        totalExperience += levelThreshold; // 必要経験値を繰り戻す

        // 特定レベル（例: 4, 9, 14...）を下回った場合の処理
        if ((newLevel + 1) % battleConfig.levelMilestone === 0) {
          bonusIncrement -= battleConfig.iIncreasePerLevel; // 追加増加量を取り消す
        }
      }
    }

    // ユーザー情報を更新
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        experience: totalExperience,
        level: newLevel,
        hp: user.hp + bonusIncrement, // 特定レベル到達時に+2
        maxHp: user.maxHp + bonusIncrement, // 特定レベル到達時に+2
        attackPower: user.attackPower + bonusIncrement, // 特定レベル到達時に+2
        healingPower: user.healingPower + bonusIncrement, // 特定レベル到達時に+2
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
