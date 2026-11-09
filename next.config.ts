import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inlined into server and client bundles alike, so prerendered relative
  // ages ("3 days ago") hydrate without a mismatch. See relative-time.tsx.
  env: { BUILD_TIME: String(Date.now()) },
  // Routes that render on demand read the split release data at runtime
  // (see scripts/split-data.mjs), so it has to ship with their functions.
  outputFileTracingIncludes: {
    "/api/releases/[tag]": ["./generated/releases/**/*"],
    "/releases/[tag]": ["./generated/releases/**/*"],
    "/releases/[tag]/opengraph-image": [
      "./generated/releases/index.json",
      "./src/lib/og/fonts/*.ttf",
    ],
  },
};

export default nextConfig;
