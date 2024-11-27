import { FolderWithQuizzes, Quiz } from "@/types/quiz";
import QuizItem from "./quiz-item";

interface QuizListProps {
  quizzes: Quiz[]; // Quiz 型の配列に変更
  selectedFile: FolderWithQuizzes["files"][0] | null;
}

export default function QuizList({ quizzes, selectedFile }: QuizListProps) {
  return (
    <div>
      {quizzes.length ? (
        <div className="divide-y divide-border rounded-md border">
          {quizzes.map((quiz) => (
            <QuizItem key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div>フォルダがありません</div>
      )}
    </div>
  );
}
