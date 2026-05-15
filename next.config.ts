import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  // We remove the eslint property as it is no longer supported in next.config.ts for this version
};

export default nextConfig;
