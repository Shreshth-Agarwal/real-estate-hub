import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/auth", "@repo/api-client"],
  experimental: {
    turbo: {
      resolveAlias: {
        "@repo/ui": "../../packages/ui/src",
        "@repo/types": "../../packages/types/src",
        "@repo/auth": "../../packages/auth/src",
        "@repo/api-client": "../../packages/api-client/src",
      },
    },
  },
};

export default nextConfig;