import { FolderWithQuizzes } from "@/types/quiz";
import QuizList from "./quiz-list";
import QuizCreateButton from "./quiz-create-button";

interface QuizSectionProps {
  quizzes: FolderWithQuizzes["files"][0]["quizzes"];
  selectedFile: FolderWithQuizzes["files"][0] | null;
  onBack?: () => void; // モバイルビュー用の戻る機能
}

export default function QuizSection({
  quizzes,
  onBack,
  selectedFile,
}: QuizSectionProps) {
  return (
    <div className="p-4 border rounded-md">
      {onBack && (
        <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
          戻る
        </button>
      )}

      <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between gap-2 mb-4">
        <h3 className="font-bold text-lg sm:text-base">クイズ</h3>
        {/* 条件付きで FileDialog を表示 */}
        {selectedFile && <QuizCreateButton selectedFile={selectedFile} />}
      </div>
      <QuizList quizzes={quizzes} />
    </div>
  );
}
