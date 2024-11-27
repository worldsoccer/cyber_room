import FileCreateDialog from "./file-create-dialog";
import FileList from "./file-list";
import { FolderWithQuizzes } from "@/types/quiz";

interface FileSectionProps {
  files: FolderWithQuizzes["files"];
  selectedFolder: FolderWithQuizzes["foldes"][0] | null; // 現在選択中のフォルダ
  selectedFile: FolderWithQuizzes["files"][0] | null;
  onSelectFile: (file: FolderWithQuizzes["files"][0]) => void;
  onBack?: () => void; // モバイルビュー用の戻る機能
}

export default function FileSection({
  files,
  selectedFolder,
  selectedFile,
  onSelectFile,
  onBack,
}: FileSectionProps) {
  // console.log("files", selectedFile);
  return (
    <div className="p-4 border rounded-md">
      {onBack && (
        <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
          戻る
        </button>
      )}
      <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between gap-2 mb-4">
        <h3 className="font-bold text-lg sm:text-base">ファイル</h3>
        {/* 条件付きで FileDialog を表示 */}
        {selectedFolder && <FileCreateDialog selectedFolder={selectedFolder} />}
      </div>
      <FileList
        files={files}
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
      />
    </div>
  );
}
