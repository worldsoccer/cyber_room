import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import NewQuiz from "@/components/quiz/new-quiz";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface NewQuizProps {
  params: Promise<{ fileId: string }>; // params を Promise として扱う
}

async function getNewQuizForUser(fileId: number, userId: string) {
  return await db.file.findFirst({
    where: {
      id: fileId,
      authorId: userId,
    },
  });
}

export default async function NewQuizPage({ params }: NewQuizProps) {
  const resolvedParams = await params; // params を await で解決

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { user } = session;

  // const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  // params.fileId を数値に変換
  const fileId = parseInt(resolvedParams.fileId, 10);
  if (isNaN(fileId)) {
    notFound(); // fileId が無効な場合 404
  }

  // ファイルを取得
  const file = await getNewQuizForUser(fileId, user.id);
  if (!file) {
    notFound(); // ファイルが存在しない場合
  }

  return <NewQuiz fileId={fileId} />;
}
