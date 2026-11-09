import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

// Satori can't read CSS variables or oklch(), so these are the light theme
// tokens from globals.css converted to sRGB hex. Keep them in sync.
export const og = {
  background: "#fafaf9",
  card: "#ffffff",
  foreground: "#171613",
  muted: "#5c5b56",
  border: "#e0dfdd",
  secondary: "#f1f0ee",
  signal: "#ce5700",
  signalSoft: "#ffeed6",
  signalInk: "#9e3800",
};

const FONT_DIR = path.join(process.cwd(), "src", "lib", "og", "fonts");

export async function loadFonts() {
  const [regular, semibold, mono] = await Promise.all([
    readFile(path.join(FONT_DIR, "Geist-Regular.ttf")),
    readFile(path.join(FONT_DIR, "Geist-SemiBold.ttf")),
    readFile(path.join(FONT_DIR, "GeistMono-SemiBold.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 600 as const, style: "normal" as const },
  ];
}

export function Wordmark() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 32,
        color: og.muted,
      }}
    >
      <span style={{ fontFamily: "Geist Mono", color: og.foreground }}>
        Next.js Releases
      </span>
      <span>next-js-release.vercel.app</span>
    </div>
  );
}

/** Font size that keeps a version tag on one line inside the safe area. */
export function fitVersion(tag: string, max: number, width = 1080) {
  // Geist Mono advance width is about 0.6em.
  return Math.min(max, Math.floor(width / (tag.length * 0.6)));
}
