import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import BossCreateButton from "@/components/dashboard/battletower/boss-create-button";
import DashBoardShell from "@/components/dashboard/dashboard-shell";
import DashBoardHeader from "@/components/dashboard/dashboard-header";
import BossItem from "@/components/dashboard/battletower/boss-item";
import EmptyPlaceholder from "@/components/dashboard/empty-placeholer";

export default async function DashboardBtlTwrStgPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  const bosses = await db.boss.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      maxHp: true,
      attackPower: true,
      attackTurn: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashBoardShell>
      <DashBoardHeader heading="バトルタワー管理" text="ボスを作成・編集・削除">
        <BossCreateButton />
      </DashBoardHeader>
      <div>
        {bosses.length ? (
          <div className="divide-y divide-border rounded-md border">
            {bosses.map((boss) => (
              <BossItem key={boss.id} boss={boss} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              ボスが登録されていません。
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              ボスを作成してください。
            </EmptyPlaceholder.Description>
            <BossCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashBoardShell>
  );
}
