// QuizItem.tsx
// import { FolderWithQuizzes } from "@/types/quiz";

// interface QuizItemProps {
//   quiz: FolderWithQuizzes["quiz"][0];
// }

// export default function QuizItem({ quiz }: QuizItemProps) {
//   return (
//     <div>
//       {/* クイズの情報を表示する */}
//       <p>{quiz.title}</p>
//     </div>
//   );
// }

import { Quiz } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import QuizOperations from "./quiz-operations";
// import FolderOperations from "./folder-operations";

interface QuizItemProps {
  quiz: Pick<Quiz, "id" | "title" | "createdAt">;
}

export default function QiuzItem({ quiz }: QuizItemProps) {
  return (
    <div className="flex items-center justify-between p-4 ">
      <div className="grid gap-1">
        <Link
          href={`/editquiz/${quiz.id}`}
          className=" font-semibold hover:underline"
        >
          {quiz.title}
        </Link>

        {/* 作成日時 */}
        <p className="text-sm text-muted-foreground">
          {format(new Date(quiz.createdAt), "yyyy-MM-dd")}
        </p>
      </div>

      {/* その他操作 (例: 編集や削除) */}
      <QuizOperations quiz={quiz} />
    </div>
  );
}
