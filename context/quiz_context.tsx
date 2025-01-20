"use client";

import { Quiz } from "@/types/quiz";
// import { Quiz } from "@/types/quiz";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Folder {
  id: number;
  name: string;
  questionCount: number;
}

interface QuizContextType {
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder | null) => void;
  selectedQuestions: number | null;
  setSelectedQuestions: (questions: number | null) => void;
  selectedMode: string | null;
  setSelectedMode: (mode: string | null) => void;
  selectedUserLevel: number | null;
  setSelectedUserLevel: (level: number | null) => void;
  difficulty: number | null;
  setDifficulty: (difficulty: number | null) => void;
  selectedBattleQuizzes: Quiz[];
  setSelectedBattleQuizzes: (quizzes: Quiz[]) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<number | null>(
    null
  );
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedUserLevel, setSelectedUserLevel] = useState<number | null>(
    null
  );
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [selectedBattleQuizzes, setSelectedBattleQuizzes] = useState<Quiz[]>(
    []
  );

  return (
    <QuizContext.Provider
      value={{
        selectedFolder,
        setSelectedFolder,
        selectedQuestions,
        setSelectedQuestions,
        selectedMode,
        setSelectedMode,
        selectedUserLevel,
        setSelectedUserLevel,
        difficulty,
        setDifficulty,
        selectedBattleQuizzes,
        setSelectedBattleQuizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};
