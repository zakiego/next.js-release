import { Suspense } from "react";
import { BoardView, type ChannelFilter } from "@/app/(home)/board-view";
import { LatestCard } from "@/app/(home)/latest-card";
import { ReleaseBoard } from "@/app/(home)/release-board";
import { groupByLine, PAGE_SIZE, SITE_NAME, SITE_URL } from "@/lib/release";
import {
  getLatest,
  getNewest,
  getReleases,
  toSummary,
} from "@/lib/releases.server";

export default function HomePage() {
  const releases = getReleases().map(toSummary);
  const latestStable = getLatest("stable");
  const latestCanary = getLatest("canary");
  const newestTag = getNewest()?.tag;

  // Server-rendered first page of the board, shown until the interactive
  // board (which reads the URL) hydrates. Keeps rows in the static HTML.
  const lineCounts: Record<string, number> = {};
  const channelCounts: Record<ChannelFilter, number> = {
    all: releases.length,
    stable: 0,
    prerelease: 0,
  };
  for (const r of releases) {
    lineCounts[r.line] = (lineCounts[r.line] ?? 0) + 1;
    channelCounts[r.channel === "stable" ? "stable" : "prerelease"]++;
  }
  const fallback = (
    <BoardView
      groups={groupByLine(releases.slice(0, PAGE_SIZE))}
      lineCounts={lineCounts}
      channelCounts={channelCounts}
      query=""
      channel="all"
      shown={PAGE_SIZE}
      matching={releases.length}
      newestTag={newestTag}
    />
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "An unofficial, searchable index of every Next.js release.",
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pt-4 sm:gap-8 sm:px-6 sm:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-2">
        <h1 className="max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-balance sm:text-3xl">
          Every Next.js release, stable and canary
        </h1>
        <p className="max-w-xl text-sm text-pretty text-muted-foreground sm:text-base">
          {releases.length.toLocaleString("en-US")} releases since 2016, grouped by
          minor version. Search a version or open its notes right here.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {latestStable && (
          <LatestCard
            label="Latest stable"
            release={toSummary(latestStable)}
            isNewest={latestStable.tag === newestTag}
          />
        )}
        {latestCanary && (
          <LatestCard
            label="Latest canary"
            release={toSummary(latestCanary)}
            isNewest={latestCanary.tag === newestTag}
          />
        )}
      </div>

      <Suspense fallback={fallback}>
        <ReleaseBoard releases={releases} newestTag={newestTag} />
      </Suspense>
    </main>
  );
}
