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
import { FolderWithQuizzes } from "@/types/quiz";

interface FileCreateDialogProps {
  selectedFolder?: FolderWithQuizzes["foldes"][0] | null; // 現在選択中のフォルダ
}

export default function FileCreateDialog({
  selectedFolder,
}: FileCreateDialogProps) {
  const [fileName, setFileName] = useState(""); // ファイル名の状態管理
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!fileName.trim()) {
      toast({
        title: "ファイル名を入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/files`, {
        method: "POST",
        body: JSON.stringify({ name: fileName, folderId: selectedFolder?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("ファイル作成に失敗しました");
      }

      toast({
        title: "ファイルが作成されました",
        description: `ファイル「${fileName}」が正常に作成されました。`,
      });

      setFileName(""); // 入力値をリセット
      router.refresh(); // ページをリフレッシュ
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "ファイル作成中に問題が発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center py-1 px-3">
          <Icons.add className="mr-1 h-4 w-4" />
          ファイル作成
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新しいファイルを作成</DialogTitle>
          <DialogDescription>
            ファイル名を入力し、「作成」をクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileName" className="text-right">
              ファイル名
            </Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="新しいファイル"
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
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
