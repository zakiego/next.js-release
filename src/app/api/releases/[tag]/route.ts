import { NextResponse } from "next/server";
import { getRelease, getReleaseBody } from "@/lib/releases.server";

// Rendered on first request and cached until the next deploy. Every data
// refresh is a new commit, so a deploy is the only time this can change.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tag: string }> },
) {
  const { tag } = await params;
  const release = getRelease(decodeURIComponent(tag));

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  return NextResponse.json({
    tag: release.tag,
    title: release.title,
    url: release.url,
    body: getReleaseBody(release),
  });
}
