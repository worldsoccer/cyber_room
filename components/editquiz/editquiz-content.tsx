"use client";

import { useState } from "react";

interface EditQuizContentProps {
  className?: string; // オプションの追加スタイル
}

export default function EditQuizContent({
  className,
  ...props // props を明示的に定義
}: EditQuizContentProps) {
  return (
    <div className="w-full">
      {/* デスクトップビュー */}
      <div className="hidden md:grid grid-cols-3 gap-4"></div>
    </div>
  );
}
