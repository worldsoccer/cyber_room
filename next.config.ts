import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 開発環境と本番環境で共通の remotePatterns を設定
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzmqqrivmefdpxpqunoq.supabase.co",
        pathname: "/storage/v1/object/public/public-img-bucket/uploads/**",
      },
    ],
    // 開発環境では画像最適化を無効化、本番環境では有効化
    unoptimized: isDev,
  },
};

export default nextConfig;
