import { ImageResponse } from "next/og";
import { loadFonts, og, OG_SIZE, Wordmark } from "@/lib/og/shared";
import { getLatest, getReleases } from "@/lib/releases.server";

export const alt =
  "Next.js Releases: the latest stable and canary versions of Next.js";
export const size = OG_SIZE;
export const contentType = "image/png";

function Row({ label, tag, first }: { label: string; tag: string; first?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "22px 0",
        borderTop: first ? "none" : `2px dashed ${og.border}`,
      }}
    >
      <span style={{ fontSize: 34, color: og.muted }}>{label}</span>
      <span style={{ fontFamily: "Geist Mono", fontSize: 48, color: og.foreground }}>
        {tag}
      </span>
    </div>
  );
}

export default async function Image() {
  const stable = getLatest("stable");
  const canary = getLatest("canary");
  const count = getReleases().length.toLocaleString("en-US");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          background: og.background,
          fontFamily: "Geist",
          color: og.foreground,
        }}
      >
        <Wordmark />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Every Next.js release, stable and canary
          </div>
          <div style={{ fontSize: 34, color: og.muted }}>
            {`${count} releases since 2016, with notes for each one.`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: og.card,
            border: `2px solid ${og.border}`,
            borderRadius: 16,
            padding: "4px 36px",
          }}
        >
          {stable && <Row label="Latest stable" tag={stable.tag} first />}
          {canary && <Row label="Latest canary" tag={canary.tag} />}
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
