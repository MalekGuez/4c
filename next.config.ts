import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@next/font'],
  },
  // Optimize bundle splitting and preloading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization
  trailingSlash: false,
  poweredByHeader: false,
  // Disable ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
