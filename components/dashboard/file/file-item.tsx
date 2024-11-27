import { File } from "@prisma/client";
import { format } from "date-fns";
import FileOperations from "./file-operations";
import { cn } from "@/lib/utils";

interface FileItemProps {
  file: Pick<File, "id" | "name" | "folderId" | "createdAt">;
  isSelected: boolean; // フォルダが選択されているかどうか
  onClick: () => void; // フォルダ選択時のコールバック
}

export default function FileItem({ file, isSelected, onClick }: FileItemProps) {
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
        <span className="font-semibold">{file.name}</span>

        {/* 作成日時 */}
        <p className="text-sm text-muted-foreground">
          {format(new Date(file.createdAt), "yyyy-MM-dd")}
        </p>
      </div>

      {/* その他操作 (例: 編集や削除) */}
      <FileOperations file={file} />
    </div>
  );
}
