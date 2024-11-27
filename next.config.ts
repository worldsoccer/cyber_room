// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   experimental: {
//     fontLoaders: [{ loader: '@next/font/google', options: { display: 'swap' } }],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eactStrictMode: true,
  images: {
    domains: ["https://nzmqqrivmefdpxpqunoq.supabase.co"], // Supabase のドメインを追加
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzmqqrivmefdpxpqunoq.supabase.co",
        pathname: "/storage/v1/object/public/public-img-bucket/uploads/**",
      },
    ],
    // 必要であれば画像最適化を無効化
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
