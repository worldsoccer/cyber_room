import FolderCreateDialog from "./folder-create-dialog";
import FolderList from "./folder-list";
import { FolderWithQuizzes } from "@/types/quiz";

interface FolderSectionProps {
  folders: FolderWithQuizzes[]; // フォルダ情報
  selectedFolder: FolderWithQuizzes | null; // 現在選択中のフォルダ
  onSelectFolder: (folder: FolderWithQuizzes) => void; // フォルダ選択時のコールバック
}

export default function FolderSection({
  folders,
  selectedFolder,
  onSelectFolder,
}: FolderSectionProps) {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between gap-2 mb-4">
        <h3 className="font-bold text-lg sm:text-base">フォルダ</h3>
        {/* フォルダ作成ダイアログ */}
        <FolderCreateDialog />
      </div>
      {/* フォルダ一覧 */}
      <FolderList
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={onSelectFolder}
      />
    </div>
  );
}
