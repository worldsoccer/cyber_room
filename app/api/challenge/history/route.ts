import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { user } = session;

    // ユーザーのクリア履歴を取得
    const progressData = await db.gameProgress.findMany({
      where: { userId: user.id },
      select: {
        folderId: true,
        totalQuestions: true,
        clearCount: true,
        lastClearedAt: true,
        mode: true,
      },
      orderBy: { lastClearedAt: "desc" },
    });

    // フォルダIDリストから一括でフォルダ名を取得
    const folderIds = [...new Set(progressData.map((item) => item.folderId))];
    const folders = await db.folder.findMany({
      where: { id: { in: folderIds } },
      select: { id: true, name: true },
    });

    // フォルダ名をIDでマッピング
    const folderMap = folders.reduce((map, folder) => {
      map[folder.id] = folder.name;
      return map;
    }, {} as Record<number, string>);

    // 履歴データにフォルダ名を追加
    const history = progressData.map((item) => ({
      ...item,
      folderName: folderMap[item.folderId] || "不明なフォルダ",
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
