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

export default function FolderCreateDialog() {
  const [folderName, setFolderName] = useState(""); // フォルダ名の状態管理
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
      // API リクエストを送信
      const response = await fetch("/api/folders", {
        method: "POST",
        body: JSON.stringify({ name: folderName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("フォルダ作成に失敗しました");
      }

      toast({
        title: "フォルダが作成されました",
        description: `フォルダ「${folderName}」が正常に作成されました。`,
      });

      setFolderName(""); // 入力値をリセット
      router.refresh(); // ページをリフレッシュ
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description:
          "フォルダ作成中に問題が発生しました。もう一度お試しください。",
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
          フォルダ作成
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新しいフォルダを作成</DialogTitle>
          <DialogDescription>
            フォルダ名を入力し、「作成」をクリックしてください。
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
              placeholder="新しいフォルダ"
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
