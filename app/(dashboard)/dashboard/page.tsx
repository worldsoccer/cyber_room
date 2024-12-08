import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DashBoardHeader from "@/components/dashboard/dashboard-header";
import DashBoardShell from "@/components/dashboard/dashboard-shell";
import DashBoardContent from "@/components/dashboard/dashboard-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/login");
  }

  // console.log("session", session?.user);

  // フォルダからクイズを取得する関数
  const folderWithQuizzes = await db.folder.findMany({
    where: {
      authorId: session?.user.id,
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
