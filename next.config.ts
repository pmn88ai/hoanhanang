import type { NextConfig } from "next";

// Next.js 16 config — no middleware, auth via server components
const nextConfig: NextConfig = {
  env: {
    SHADOW_SLUG: process.env.SHADOW_SLUG,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
