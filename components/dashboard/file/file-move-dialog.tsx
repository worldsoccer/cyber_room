"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFolders } from "@/hooks/use-folder";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface FileMoveDialogProps {
  fileId: number; // 移動対象のファイルID
}

export default function FileMoveDialog({ fileId }: FileMoveDialogProps) {
  const { folders, isLoading, error } = useFolders(); // フォルダ情報を取得
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleMove = async () => {
    if (!selectedFolderId) {
      console.error("フォルダが選択されていません");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/files/${fileId}/move`, {
        method: "PATCH",
        body: JSON.stringify({ folderId: selectedFolderId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("ファイル移動に失敗しました");
      }

      toast({
        title: `ファイルがフォルダID「${selectedFolderId}」に移動しました`,
        description: `正常に更新されました。`,
      });

      router.refresh(); // ページをリフレッシュ
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "ファイル移動中に問題が発生しました。",
        variant: "destructive",
      });
      console.error("エラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Loading folders...</p>;
  }

  if (error) {
    return <p>Failed to load folders</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-left text-destructive py-2 text-gray-700 hover:bg-gray-100 cursor-pointer focus:text-destructive">
          移動
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ファイルを移動</DialogTitle>
          <DialogDescription>
            ファイルを移動するフォルダを選択してください。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={(value) => setSelectedFolderId(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="フォルダを選択してください" />
            </SelectTrigger>
            <SelectContent>
              {folders.map((folder: { id: number; name: string }) => (
                <SelectItem key={folder.id} value={folder.id.toString()}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleMove} disabled={isSubmitting}>
            {isSubmitting ? "移動中..." : "移動"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
