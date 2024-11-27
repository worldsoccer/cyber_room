import { Folder } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FolderOperations from "./folder-operations";

interface FolderItemProps {
  folder: Pick<Folder, "id" | "name" | "authorId" | "createdAt">;
  isSelected: boolean; // フォルダが選択されているかどうか
  onClick: () => void; // フォルダ選択時のコールバック
}

export default function FolderItem({
  folder,
  isSelected,
  onClick,
}: FolderItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full p-4 rounded-md cursor-pointer",
        isSelected ? "bg-gray-300" : "hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <div className="grid gap-1 text-left">
        {/* フォルダ名 */}
        <span className="font-semibold">{folder.name}</span>

        {/* 作成日時 */}
        <p className="text-sm text-muted-foreground">
          {format(new Date(folder.createdAt), "yyyy-MM-dd")}
        </p>
      </div>

      {/* その他操作 (例: 編集や削除) */}
      <FolderOperations folder={folder} />
    </div>
  );
}
