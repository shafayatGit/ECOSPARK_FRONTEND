import type { NextConfig } from "next";

interface ExtendedNextConfig extends NextConfig {
  serverActions?: {
    bodySizeLimit: string;
  };
}

const nextConfig: ExtendedNextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
