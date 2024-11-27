import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Googleのプロフィール画像
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHubのプロフィール画像
      },
      {
        protocol: "https",
        hostname: "nzmqqrivmefdpxpqunoq.supabase.co", // Supabaseの画像
        pathname: "/storage/v1/object/public/public-img-bucket/uploads/**", // パス指定で制限を細かく設定
      },
    ],
  },
};

export default nextConfig;
