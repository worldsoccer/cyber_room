import BattleTowerSelection from "@/components/dashboard/battletower/battleTower-selection";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Quiz } from "@/types/quiz";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function BattleTowerPage() {
  const session = await getServerSession(authOptions);

  // ユーザーがログインしていない場合はリダイレクト
  if (!session?.user.id) {
    redirect("/login");
  }

  // ユーザー情報を取得
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      experience: true,
      level: true,
    },
  });

  if (!user) {
    return (
      <p className="text-center text-lg font-semibold">
        ユーザー情報が見つかりません。
      </p>
    );
  }

  // フォルダデータを取得
  const folders = await db.folder.findMany({
    where: { authorId: session.user.id },
    include: {
      files: {
        include: {
          quizzes: {
            include: {
              questions: true, // クイズに紐づく質問を取得
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // フォルダデータを整形
  const formattedFolders = folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    files: folder.files.map((file) => ({
      id: file.id,
      name: file.name,
      quizzes: file.quizzes.map((quiz: Quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description || "", // 空文字列を代入
        questionCount: quiz.questions.length, // クイズごとの質問数
      })),
    })),
  }));

  if (formattedFolders.length === 0) {
    return (
      <p className="text-center text-lg font-semibold">
        クイズが登録されていません。
      </p>
    );
  }

  // データを BattleTowerSelection に渡す
  return (
    <BattleTowerSelection
      userExperience={user.experience}
      userLevel={user.level}
      folders={formattedFolders}
    />
  );
}
