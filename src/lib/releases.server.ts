import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  channelOf,
  compareVersions,
  lineOf,
  type Channel,
  type ReleaseSummary,
} from "@/lib/release";

// Written by scripts/split-data.mjs before dev and build. The index holds
// every published release without notes, already validated against the
// schema there, and each body lives in its own file. A cold function reads
// the small index plus one notes file, never the full 5 MB data.json.
const DATA_DIR = path.join(process.cwd(), "generated", "releases");

type IndexedRelease = {
  id: number;
  tag: string;
  name: string;
  url: string;
  prerelease: boolean;
  publishedAt: string;
};

export type Release = ReleaseSummary & {
  id: number;
  title: string;
  url: string;
};

type ReleaseIndex = {
  releases: Release[];
  byTag: Map<string, Release>;
};

let memo: ReleaseIndex | null = null;

function load(): ReleaseIndex {
  if (memo) return memo;
  const indexed = JSON.parse(
    readFileSync(path.join(DATA_DIR, "index.json"), "utf8"),
  ) as IndexedRelease[];

  const releases: Release[] = indexed
    .map((r) => ({
      id: r.id,
      tag: r.tag,
      title: r.name.trim() || r.tag,
      channel: channelOf(r.tag, r.prerelease),
      line: lineOf(r.tag),
      publishedAt: r.publishedAt,
      url: r.url,
    }))
    .sort((a, b) => compareVersions(b.tag, a.tag));

  memo = { releases, byTag: new Map(releases.map((r) => [r.tag, r])) };
  return memo;
}

export const getReleases = cache((): Release[] => load().releases);

export const getRelease = cache(
  (tag: string): Release | undefined => load().byTag.get(tag),
);

/** The release's markdown notes, read from its own file. */
export const getReleaseBody = cache((release: Release): string =>
  readFileSync(path.join(DATA_DIR, "notes", `${release.id}.md`), "utf8"),
);

export function toSummary(release: Release): ReleaseSummary {
  return {
    tag: release.tag,
    channel: release.channel,
    line: release.line,
    publishedAt: release.publishedAt,
  };
}

export function getLatest(channel: Channel | "prerelease") {
  return getReleases().find((r) =>
    channel === "prerelease" ? r.channel !== "stable" : r.channel === channel,
  );
}

/** The single most recently published release, marked with the signal color. */
export function getNewest(): Release | undefined {
  let newest: Release | undefined;
  for (const r of getReleases()) {
    if (!newest || r.publishedAt > newest.publishedAt) newest = r;
  }
  return newest;
}

/** Neighbours in version order, used for previous / next links. */
export function getNeighbours(tag: string) {
  const releases = getReleases();
  const index = releases.findIndex((r) => r.tag === tag);
  return {
    newer: index > 0 ? releases[index - 1] : undefined,
    older: index >= 0 ? releases[index + 1] : undefined,
  };
}
