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

interface FileEditDialogProps {
  fileId: number; // 編集対象のファイルID
  initialFileName: string; // 編集時の初期ファイル名
}

export default function FileEditDialog({
  fileId,
  initialFileName,
}: FileEditDialogProps) {
  const [fileName, setFileName] = useState(initialFileName); // ファイル名の状態管理
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
      const response = await fetch(`/api/files/${fileId}/name`, {
        method: "PATCH",
        body: JSON.stringify({ name: fileName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("ファイル更新に失敗しました");
      }

      toast({
        title: "ファイルが更新されました",
        description: `ファイル「${fileName}」が正常に更新されました。`,
      });

      router.refresh(); // ページをリフレッシュ
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "ファイル更新中に問題が発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-left text-destructive py-2 text-gray-700 hover:bg-gray-100 cursor-pointer focus:text-destructive">
          編集
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ファイルを編集</DialogTitle>
          <DialogDescription>
            ファイル名を入力し、「保存」をクリックしてください。
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
              placeholder="ファイル名"
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
