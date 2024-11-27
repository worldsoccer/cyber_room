"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "../../icon/icon";
import { useRouter } from "next/navigation";

interface FolderEditDialogProps {
  folderId: number; // PATCH用にフォルダIDを受け取る
  initialFolderName: string; // 編集用の初期フォルダ名
}

export default function FolderEditDialog({
  folderId,
  initialFolderName,
}: FolderEditDialogProps) {
  const [folderName, setFolderName] = useState(initialFolderName); // フォルダ名の状態管理
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      toast({
        title: "フォルダ名を入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // API エンドポイントとメソッドを設定
      const url = `/api/folders/${folderId}`;
      const method = "PATCH";

      // API リクエストを送信
      const response = await fetch(url, {
        method,
        body: JSON.stringify({ name: folderName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("フォルダ更新に失敗しました");
      }

      toast({
        title: "フォルダが更新されました",
        description: `フォルダ「${folderName}」が正常に更新されました。`,
      });

      router.refresh(); // ページをリフレッシュ
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description:
          "フォルダ更新中に問題が発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="w-full h-full cursor-pointer flex items-center justify-start px-2 py-2 rounded"
          style={{
            border: "none",
            background: "transparent",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={
            (e) =>
              (e.currentTarget.style.backgroundColor = "rgba(243, 244, 246, 1)") // 薄い灰色
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <span className="text-gray-700">編集</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>フォルダを編集</DialogTitle>
          <DialogDescription>
            フォルダ名を入力し、「保存」をクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folderName" className="text-right">
              フォルダ名
            </Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="フォルダ名"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <Icons.spinner className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Icons.add className="mr-2 h-4 w-4" />
            )}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
