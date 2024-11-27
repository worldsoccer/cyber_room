"use client";

import Link from "next/link";
import { Quiz } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icon/icon";
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

async function deleteQuiz(quizId: string) {
  try {
    const response = await fetch(`/api/quizes/${quizId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the quiz.");
    }

    return true;
  } catch (error) {
    // toast({
    //   title: "Something went wrong.",
    //   description: "Your post was not deleted. Please try again.",
    //   variant: "destructive",
    // });

    return false; // エラーが発生した場合は false を返す
  }
}

interface QuizOperationsProps {
  quiz: Pick<Quiz, "id" | "title">;
}

export default function QuizOperations({ quiz }: QuizOperationsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href={`/editquiz/${quiz.id}`} className="w-full">
              編集
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-destructive cursor-pointer focus:text-destructive"
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              本当にこのクイズを削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り返しができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsDeleteLoading(true);

                const deleted = await deleteQuiz(String(quiz.id));

                if (deleted) {
                  setIsDeleteLoading(false);
                  setShowDeleteAlert(false);
                  toast({
                    description: "クイズが正常に削除されました。",
                  });
                  router.refresh();
                } else {
                  setIsDeleteLoading(false);
                  toast({
                    title: "Something went wrong.",
                    description: "Your post was not deleted. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>削除</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
