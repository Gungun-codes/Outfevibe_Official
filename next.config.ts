import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  transpilePackages: ["@mediapipe/tasks-vision"],
};

export default nextConfig;