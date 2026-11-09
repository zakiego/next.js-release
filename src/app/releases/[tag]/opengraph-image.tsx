import { ImageResponse } from "next/og";
import { CHANNEL_LABEL, formatDate } from "@/lib/release";
import { fitVersion, loadFonts, og, OG_SIZE, Wordmark } from "@/lib/og/shared";
import { getRelease } from "@/lib/releases.server";

export const alt = "Next.js release notes";
export const size = OG_SIZE;
export const contentType = "image/png";
// Render once per tag and cache until the next deploy.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

export default async function Image({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const release = getRelease(decodeURIComponent(tag));
  const version = release?.tag ?? decodeURIComponent(tag);
  const stable = release?.channel === "stable";

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
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 40, color: og.muted }}>Next.js</span>
            {release && (
              <span
                style={{
                  fontFamily: "Geist Mono",
                  fontSize: 32,
                  padding: "6px 22px",
                  borderRadius: 999,
                  background: stable ? og.foreground : og.card,
                  color: stable ? og.card : og.foreground,
                  border: `2px solid ${stable ? og.foreground : og.border}`,
                }}
              >
                {CHANNEL_LABEL[release.channel]}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "Geist Mono",
              fontSize: fitVersion(version, 150),
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {version}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px dashed ${og.border}`,
            paddingTop: 28,
            fontSize: 34,
            color: og.muted,
          }}
        >
          <span>
            {release ? `Published ${formatDate(release.publishedAt)}` : "Release notes"}
          </span>
          {release && (
            <span style={{ color: og.foreground, fontWeight: 600 }}>
              {`${release.line} line`}
            </span>
          )}
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
