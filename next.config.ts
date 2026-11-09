import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Routes that render on demand read public/data.json at runtime, so the
  // file has to ship with their functions.
  outputFileTracingIncludes: {
    "/api/releases/[tag]": ["./public/data.json"],
    "/releases/[tag]": ["./public/data.json"],
    "/releases/[tag]/opengraph-image": [
      "./public/data.json",
      "./src/lib/og/fonts/*.ttf",
    ],
  },
};

export default nextConfig;
