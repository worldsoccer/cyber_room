import BossEdit from "@/components/dashboard/battletower/boss-edit";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

interface BossEditProps {
  params: Promise<{ bossId: string }>; // params を Promise として扱う
}

async function getNewBossForUser(bossId: number) {
  return await db.boss.findFirst({
    where: {
      id: bossId,
    },
  });
}

export default async function BossEditPage({ params }: BossEditProps) {
  const resolvedParams = await params; // params を await で解決

  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  // params.quizId を数値に変換
  const bossId = parseInt(resolvedParams.bossId, 10);
  if (isNaN(bossId)) {
    notFound(); // fileId が無効な場合 404
  }

  // ボス情報を取得
  const bossData = await getNewBossForUser(bossId);
  if (!bossData) {
    notFound(); // ボス情報が存在しない場合
  }

  return <BossEdit bossId={bossId} />;
}
