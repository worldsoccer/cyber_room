import { FolderWithQuizzes } from "@/types/quiz";
import FileItem from "./file-item";

interface FileListProps {
  files: FolderWithQuizzes[]; // フォルダ情報の配列
  selectedFile: FolderWithQuizzes | null; // 現在選択されているフォルダ
  onSelectFile: (folder: FolderWithQuizzes) => void; // フォルダ選択時のコールバック
}

export default function FileList({
  files,
  selectedFile,
  onSelectFile,
}: FileListProps) {
  return (
    <div>
      {files.length ? (
        <div className="divide-y divide-border rounded-md border">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              isSelected={selectedFile?.id === file.id}
              onClick={() => onSelectFile(file)}
            />
          ))}
        </div>
      ) : (
        <div>フォルダがありません</div>
      )}
    </div>
  );
}
