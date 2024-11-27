"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../../icon/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// 削除関数
async function deleteFile(fileId: number) {
  try {
    const response = await fetch(`/api/files/${fileId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed");
    }

    return true;
  } catch (err) {
    toast({
      title: "問題が発生しました。",
      description: "ファイルの削除ができませんでした。もう一度お試しください。",
      variant: "destructive",
    });
    return false;
  }
}

interface FileDeleteDialogProps {
  fileId: number; // ファイルID
}

export default function FileDeleteDialog({ fileId }: FileDeleteDialogProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const deleted = await deleteFile(fileId);

    if (deleted) {
      setShowDeleteAlert(false);
      router.refresh();
    }
    setIsDeleteLoading(false);
  };

  return (
    <>
      <button
        className="w-full text-left text-destructive py-2 hover:bg-gray-100 cursor-pointer focus:text-destructive"
        onClick={() => setShowDeleteAlert(true)}
      >
        削除
      </button>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              本当にこのファイルを削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り返しができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <Icons.trash className="w-4 h-4 mr-2" />
              )}
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
