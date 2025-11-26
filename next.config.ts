import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "storage.googleapis.com", "picsum.photos"],
  },
};

export default nextConfig;
