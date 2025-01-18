import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "ホーム",
      href: "/",
    },
    {
      title: "クイズゲーム",
      href: "/dashboard/gamequiz",
      // disabled: true,
    },
    {
      title: "アルティメットチャレンジ",
      href: "/dashboard/challenge",
      // disabled: true,
    },
    {
      title: "バトルタワー",
      href: "/dashboard/battletower",
      // disabled: true,
    },
    {
      title: "アルティメットヒストリー",
      href: "/dashboard/history",
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
      title: "バトルタワー設定",
      href: "/dashboard/btltwrstg",
      icon: "billing",
      // disabled: true,
    },
    {
      title: "ランキング",
      href: "/dashboard/leaderboard",
      icon: "ranking",
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
