import { Quiz } from "@/types/quiz";
import QuizItem from "./quiz-item";

interface QuizListProps {
  quizzes: Quiz[]; // Quiz 型の配列に変更
}

export default function QuizList({ quizzes }: QuizListProps) {
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
