"use client";

import { format } from "date-fns";
import Link from "next/link";
import BossOperations from "./boss-operations";

interface BossItemProps {
  boss: {
    id: number;
    name: string;
    description: string | null; // null を許容
    maxHp: number;
    attackPower: number;
    attackTurn: number;
    imageUrl: string | null;
    createdAt: Date;
  };
}

export default function BossItem({ boss }: BossItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/dashboard/boss/${boss.id}`}
          className="font-semibold hover:underline"
        >
          {boss.name}
        </Link>
        <p className="text-sm text-muted-foreground">{boss.description}</p>
        <p className="text-sm text-muted-foreground">
          登録日: {format(new Date(boss.createdAt), "yyyy-MM-dd")}
        </p>
      </div>
      <BossOperations boss={boss} />
    </div>
  );
}
