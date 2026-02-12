import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.menu.lazeez.mv",
      },
      {
        protocol: "https",
        hostname: "www.lazeez.mv",
      },
    ],
  },
};

export default nextConfig;
