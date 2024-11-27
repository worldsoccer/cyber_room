import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import Link from "next/link";
import { ReactNode } from "react";

interface MobileNavProps {
  items: MainNavItem[];
  children?: ReactNode;
}

export default function MobileNav({ items, children }: MobileNavProps) {
  useLockBodyScroll();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href={"/"} className="flex items-center space-x-2">
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              href={item.disabled ? "#" : item.href}
              key={index}
              className={cn(
                "flex items-center w-full rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
