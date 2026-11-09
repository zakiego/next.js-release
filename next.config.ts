import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inlined into server and client bundles alike, so prerendered relative
  // ages ("3 days ago") hydrate without a mismatch. See relative-time.tsx.
  env: { BUILD_TIME: String(Date.now()) },
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
