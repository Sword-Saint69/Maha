import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: '.next',
  images: {
    unoptimized: true, // Required for Electron
  },
};

export default nextConfig;
