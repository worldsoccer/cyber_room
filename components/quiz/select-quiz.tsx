"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FolderWithQuizzes } from "@/types/quiz";

interface SelectQuizProps {
  folderWithQuizzes: FolderWithQuizzes[];
}

const SelectQuiz: React.FC<SelectQuizProps> = ({ folderWithQuizzes }) => {
  const router = useRouter();

  const handleQuizStart = (quizId: number) => {
    router.push(`/gamequiz/${quizId}`);
  };

  const handleTestStart = (fileId: number) => {
    router.push(`/gametest/${fileId}`);
  };

  if (!folderWithQuizzes || folderWithQuizzes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-xl">
          フォルダまたはクイズが登録されていません。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        フォルダからクイズを選択してください
      </h1>
      <ul className="space-y-6">
        {folderWithQuizzes.map((folder) => (
          <li key={folder.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {folder.name}
            </h2>
            <ul className="pl-4 space-y-4">
              {folder.files?.map((file: any) => (
                <li key={file.id}>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {file.name}
                  </h3>
                  <button
                    onClick={() => handleTestStart(file.id)}
                    className="mb-4 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    テストを開始
                  </button>
                  <ul className="pl-6 list-disc text-gray-600 space-y-2">
                    {file.quizzes?.map((quiz: any) => (
                      <li
                        key={quiz.id}
                        onClick={() => handleQuizStart(quiz.id)}
                        className="cursor-pointer hover:text-blue-500 transition-colors"
                      >
                        {quiz.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectQuiz;
