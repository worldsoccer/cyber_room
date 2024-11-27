import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { User } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import NewQuiz from "@/components/quiz/new-quiz";
import EditQuiz from "@/components/editquiz/edit-quiz";

interface EditQuizProps {
  params: Promise<{ quizId: string }>; // params を Promise として扱う
}

async function getNewQuizForUser(quizId: number, userId: string) {
  return await db.quiz.findFirst({
    where: {
      id: quizId,
    },
  });
}

export default async function EditQuizPage({ params }: EditQuizProps) {
  const resolvedParams = await params; // params を await で解決

  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  // params.quizId を数値に変換
  const quizId = parseInt(resolvedParams.quizId, 10);
  if (isNaN(quizId)) {
    notFound(); // fileId が無効な場合 404
  }

  // quizを取得
  const quiz = await getNewQuizForUser(quizId, user.id);
  if (!quiz) {
    notFound(); // クイズが存在しない場合
  }

  return <EditQuiz quizId={quizId} />;
}
