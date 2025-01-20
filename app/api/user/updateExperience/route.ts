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

    // console.log(
    //   "Initial: TotalExperience=",
    //   totalExperience,
    //   "Level=",
    //   newLevel
    // );

    if (experienceGained > 0) {
      // レベルアップ処理
      while (totalExperience >= newLevel * battleConfig.levelUpMultiplier) {
        const levelThreshold = newLevel * battleConfig.levelUpMultiplier;
        totalExperience -= levelThreshold; // 必要経験値を差し引く
        newLevel += 1; // レベルアップ
        // console.log(
        //   `Level Up! New Level: ${newLevel}, Remaining Experience: ${totalExperience}`
        // );
      }
    } else if (experienceGained < 0) {
      // レベルダウン処理
      while (
        newLevel > 1 &&
        totalExperience < (newLevel - 1) * battleConfig.levelUpMultiplier
      ) {
        newLevel -= 1; // レベルダウン
        const levelThreshold = newLevel * battleConfig.levelUpMultiplier;
        totalExperience += levelThreshold; // 必要経験値を繰り戻す
        // console.log(
        //   `Level Down! New Level: ${newLevel}, Remaining Experience: ${totalExperience}`
        // );
      }
    }

    // console.log(
    //   "Final: RemainingExperience=",
    //   totalExperience,
    //   "Level=",
    //   newLevel
    // );

    // レベル差分を計算
    const levelDifference = newLevel - user.level;

    // 特定レベルごとに+2の増加分を計算
    const additionalMultiplier =
      Math.floor(newLevel / 10) - Math.floor(user.level / 10); // 10ごとの増加回数

    // ユーザー情報を更新
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        experience: totalExperience,
        level: newLevel,
        hp:
          user.hp +
          levelDifference * battleConfig.hpIncreasePerLevel +
          additionalMultiplier * 2, // 10ごとに+2
        maxHp:
          user.maxHp +
          levelDifference * battleConfig.hpIncreasePerLevel +
          additionalMultiplier * 2, // 10ごとに+2
        attackPower:
          user.attackPower +
          levelDifference * battleConfig.attackPowerIncreasePerLevel +
          additionalMultiplier * 2, // 10ごとに+2
        healingPower:
          user.healingPower +
          levelDifference * battleConfig.healingPowerIncreasePerLevel +
          additionalMultiplier * 2, // 10ごとに+2
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
