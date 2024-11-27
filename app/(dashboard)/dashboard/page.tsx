// import FolderItem from "@/components/dashboard/folder-item";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import DashBoardHeader from "@/components/dashboard/dashboard-header";
import DashBoardShell from "@/components/dashboard/dashboard-shell";
// import FolderCreateButton from "@/components/dashboard/folder-create-button";
import DashBoardContent from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // フォルダからクイズを取得する関数
  const folderWithQuizzes = await db.folder.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      files: {
        include: {
          quizzes: true, // ファイル内のクイズ情報を取得
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashBoardShell>
      <DashBoardHeader heading="クイズ一覧" text="フォルダ作成と管理">
        {/* <FolderCreateButton /> */}
      </DashBoardHeader>
      <DashBoardContent folderWithQuizzes={folderWithQuizzes} />
    </DashBoardShell>
  );
}
