import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "ホーム",
      href: "/",
    },
    {
      title: "ドキュメント",
      href: "/docs",
      // disabled: true,
    },
    {
      title: "サポート",
      href: "/support",
      // disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "クイズ一覧",
      href: "/dashboard",
      icon: "quiz",
      // disabled: true,
    },
    {
      title: "ランキング",
      href: "/dashboard/leaderboard",
      icon: "ranking",
      // disabled: true,
    },
    {
      title: "スタート",
      href: "/dashboard/gamequiz",
      icon: "start",
      // disabled: true,
    },
    {
      title: "成績確認",
      href: "/dashboard/results",
      icon: "grades",
      // disabled: true,
    },
    {
      title: "学習進捗",
      href: "/dashboard/progress",
      icon: "flag",
      // disabled: true,
    },
    {
      title: "設定",
      href: "/dashboard/settings",
      icon: "settings",
      // disabled: true,
    },
  ],
};
