// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   experimental: {
//     fontLoaders: [{ loader: '@next/font/google', options: { display: 'swap' } }],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzmqqrivmefdpxpqunoq.supabase.co",
        pathname: "/storage/v1/object/public/public-img-bucket/uploads/**",
      },
    ],
    unoptimized: true, // 画像最適化を無効化
  },
};

export default nextConfig;
