import SelectQuizMode from "@/features/challenge/select_quiz_mode";
import { challengeConfig } from "@/config/challenge";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default async function ChallengePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/login");
  }

  // フォルダごとの質問数を取得
  const foldersWithQuestionCount = await db.folder.findMany({
    where: { authorId: session.user.id },
    include: {
      files: {
        include: {
          quizzes: {
            include: {
              questions: true, // クイズに紐づく質問数を取得
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // フォルダごとの質問数を集計
  const folders = foldersWithQuestionCount.map((folder) => {
    const questionCount = folder.files.reduce((fileAcc, file) => {
      return (
        fileAcc +
        file.quizzes.reduce(
          (quizAcc, quiz) => quizAcc + quiz.questions.length,
          0
        )
      );
    }, 0);

    return {
      id: folder.id,
      name: folder.name,
      questionCount,
    };
  });

  if (!foldersWithQuestionCount || foldersWithQuestionCount.length === 0) {
    return <p>フォルダまたはクイズが登録されていません。</p>;
  }

  return <SelectQuizMode folders={folders} />;
}
