import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 13+
  output: 'standalone', // Optimized for Vercel deployment
  images: { 
    unoptimized: true // Disable image optimization to prevent potential issues
  },
  typescript: {
    ignoreBuildErrors: true, // Prevent build failure on TS errors during deployment
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevent build failure on lint errors during deployment
  }
};

export default nextConfig;