"use client";

import { useState } from "react";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { Icons } from "../../icon/icon";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FolderWithQuizzes } from "@/types/quiz";

interface QuizCreateButtonProps extends ButtonProps {
  selectedFile: FolderWithQuizzes["files"][0]; // 必須プロパティとして追加
}

export default function QuizCreateButton({
  className,
  variant,
  selectedFile,
  ...props
}: QuizCreateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onClick() {
    setIsLoading(true);

    // `editor` ページに遷移
    router.push(`/newquiz/${selectedFile.id}`);

    setIsLoading(false);
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      クイズ作成
    </button>
  );
}
