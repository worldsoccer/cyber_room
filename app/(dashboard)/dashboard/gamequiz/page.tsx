import SelectQuiz from "@/components/quiz/select-quiz";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function GameQuizPage() {
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

  if (!folderWithQuizzes || folderWithQuizzes.length === 0) {
    return <p>フォルダまたはクイズが登録されていません。</p>;
  }

  return <SelectQuiz folderWithQuizzes={folderWithQuizzes} />;
}
