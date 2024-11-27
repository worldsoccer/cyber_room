import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eactStrictMode: true,
  images: {
    domains: ["nzmqqrivmefdpxpqunoq.supabase.co"], // Supabase のドメインを追加
  },
};

export default nextConfig;
