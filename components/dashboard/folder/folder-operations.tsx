"use client";

import { Folder } from "@prisma/client";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FolderEditDialog from "./folder-edit-dialog";

// フォルダを削除する関数
async function deleteFolder(folderId: number) {
  try {
    const response = await fetch(`/api/folders/${folderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed");
    }

    return true;
  } catch (err) {
    toast({
      title: "問題が発生しました。",
      description: "フォルダの削除ができませんでした。もう一度お試しください。",
      variant: "destructive",
    });
    return false;
  }
}

interface FolderOperationsProps {
  folder: Pick<Folder, "id" | "name">;
}

export default function FolderOperations({ folder }: FolderOperationsProps) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    const deleted = await deleteFolder(folder.id);

    if (deleted) {
      setShowDeleteAlert(false);
      router.refresh();
    }
    setIsDeleteLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <FolderEditDialog
              folderId={folder.id}
              initialFolderName={folder.name}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive cursor-pointer focus:text-destructive"
            onClick={() => setShowDeleteAlert(true)}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              本当にこのフォルダを削除しますか？
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
