"use client";

import { SidebarNavItem } from "@/types";
import { usePathname } from "next/navigation";
import { Icons } from "../icon/icon";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();
  // console.log(path);

  if (!items?.length) {
    return null;
  }

  return (
    <nav>
      {items.map((item, index) => {
        const Icon = Icons[(item.icon as string) || "arrowRight"];
        return (
          item.href && (
            <Link href={item.disabled ? "/" : item.href} key={index}>
              <span
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
