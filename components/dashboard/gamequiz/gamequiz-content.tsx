"use client";

import SelectQuiz from "@/components/quiz/select-quiz";

interface GameQuizContentProps {
  className?: string; // オプションの追加スタイル
}

export default function GameQuizContent({
  className,
  ...props // props を明示的に定義
}: GameQuizContentProps) {
  return <div className="w-full">{/* <SelectQuiz /> */}</div>;
}
