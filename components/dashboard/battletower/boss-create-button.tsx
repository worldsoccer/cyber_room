"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icon/icon";

interface BossCreateButtonProps extends ButtonProps {}

export default function BossCreateButton({
  className,
  variant,
  ...props
}: BossCreateButtonProps) {
  const router = useRouter();

  function onClick() {
    // ボス作成画面に移動
    router.push("/newboss");
  }

  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      新しいボス
    </button>
  );
}
