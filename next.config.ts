import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: '.next',
  images: {
    unoptimized: true, // Required for Electron
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Allow data URIs and media-file protocol
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset',
    });
    return config;
  },
};

export default nextConfig;
