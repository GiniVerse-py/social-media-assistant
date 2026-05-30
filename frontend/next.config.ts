import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.16.0.2'],
  turbopack: {
    root: __dirname,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
  },
};

export default nextConfig;