import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Silences the webpack/turbopack conflict warning
  turbopack: {},

  // ✅ Tells Turbopack to transpile the ESM-only mediapipe package
  transpilePackages: ["@mediapipe/tasks-vision"],
};

export default nextConfig;