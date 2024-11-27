import { FolderWithQuizzes } from "@/types/quiz";
import FolderItem from "./folder-item";

interface FolderListProps {
  folders: FolderWithQuizzes[]; // フォルダ情報の配列
  selectedFolder: FolderWithQuizzes | null; // 現在選択されているフォルダ
  onSelectFolder: (folder: FolderWithQuizzes) => void; // フォルダ選択時のコールバック
}

export default function FolderList({
  folders,
  selectedFolder,
  onSelectFolder,
}: FolderListProps) {
  return (
    <div>
      {folders.length ? (
        <div className="divide-y divide-border rounded-md border">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              isSelected={selectedFolder?.id === folder.id}
              onClick={() => onSelectFolder(folder)}
            />
          ))}
        </div>
      ) : (
        <div>フォルダがありません</div>
      )}
    </div>
  );
}
