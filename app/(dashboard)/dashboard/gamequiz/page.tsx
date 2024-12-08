import SelectQuiz from "@/components/quiz/select-quiz";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function GameQuizPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/login");
  }

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

  if (!folderWithQuizzes || folderWithQuizzes.length === 0) {
    return <p>フォルダまたはクイズが登録されていません。</p>;
  }

  return <SelectQuiz folderWithQuizzes={folderWithQuizzes} />;
}
