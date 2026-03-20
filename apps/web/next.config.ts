import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.spock.replit.dev", "*.replit.dev"],
  devIndicators: false,
};

export default nextConfig;
