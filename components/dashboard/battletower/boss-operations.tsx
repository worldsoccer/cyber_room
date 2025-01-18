"use client";

import { Icons } from "@/components/icon/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BossOperationsProps {
  boss: { id: number; name: string };
}

export default function BossOperations({ boss }: BossOperationsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/bosses/${boss.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("ボスの削除に失敗しました");
      }

      toast({
        title: "成功",
        description: "ボスが削除されました。",
        variant: "default",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "エラー",
        description: "ボスの削除に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icons.ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          {isDeleting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.trash className="mr-2 h-4 w-4" />
          )}
          削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
