"use client";

import { useState } from "react";
import { FolderWithQuizzes } from "@/types/quiz";
import FolderSection from "./folder/folder-section";
import FileSection from "./file/file-section";
import QuizSection from "./quiz/quiz-section";

interface DashBoardContentProps {
  folderWithQuizzes: FolderWithQuizzes[]; // フォルダ情報の配列
}

export default function DashBoardContent({
  folderWithQuizzes,
}: DashBoardContentProps) {
  const [selectedFolder, setSelectedFolder] =
    useState<FolderWithQuizzes | null>(null); // 選択されたフォルダ
  const [selectedFile, setSelectedFile] = useState<
    FolderWithQuizzes["files"][0] | null
  >(null);
  const [currentView, setCurrentView] = useState<
    "folders" | "files" | "quizzes"
  >("folders");

  const handleFolderSelect = (folder: FolderWithQuizzes) => {
    setSelectedFolder(folder);
    setSelectedFile(null);
    setCurrentView("files");
  };

  const handleFileSelect = (file: FolderWithQuizzes["files"][0]) => {
    setSelectedFile(file);
    setCurrentView("quizzes");
  };

  const handleBack = () => {
    if (currentView === "quizzes") {
      setCurrentView("files");
    } else if (currentView === "files") {
      setCurrentView("folders");
    }
  };

  return (
    <div className="w-full">
      {/* デスクトップビュー */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        <FolderSection
          folders={folderWithQuizzes}
          selectedFolder={selectedFolder}
          onSelectFolder={handleFolderSelect}
        />
        <FileSection
          files={selectedFolder?.files || []}
          selectedFolder={selectedFolder}
          selectedFile={selectedFile}
          onSelectFile={handleFileSelect}
        />
        <QuizSection
          quizzes={selectedFile?.quizzes || []}
          selectedFile={selectedFile}
        />
      </div>

      {/* モバイルビュー */}
      <div className="md:hidden">
        {currentView === "folders" && (
          <FolderSection
            folders={folderWithQuizzes}
            selectedFolder={selectedFolder}
            onSelectFolder={handleFolderSelect}
          />
        )}
        {currentView === "files" && selectedFolder && (
          <FileSection
            files={selectedFolder.files}
            selectedFolder={selectedFolder}
            selectedFile={selectedFile}
            onSelectFile={handleFileSelect}
            onBack={handleBack}
          />
        )}
        {currentView === "quizzes" && selectedFile && (
          <QuizSection
            quizzes={selectedFile.quizzes}
            selectedFile={selectedFile}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
