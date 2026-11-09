import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { z } from "zod";
import {
  channelOf,
  compareVersions,
  lineOf,
  type Channel,
  type ReleaseSummary,
} from "@/lib/release";

const storedReleaseSchema = z.object({
  id: z.number(),
  tag_name: z.string(),
  name: z.string().nullish(),
  html_url: z.string().url(),
  prerelease: z.boolean(),
  draft: z.boolean(),
  published_at: z.string().nullish(),
  body: z.string().nullish(),
});

export type Release = ReleaseSummary & {
  id: number;
  title: string;
  url: string;
  body: string;
};

type ReleaseIndex = {
  releases: Release[];
  byTag: Map<string, Release>;
};

const DATA_FILE = path.join(process.cwd(), "public", "data.json");

let memo: ReleaseIndex | null = null;

function load(): ReleaseIndex {
  if (memo) return memo;
  const raw: unknown = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  const parsed = z.array(storedReleaseSchema).parse(raw);

  const releases: Release[] = parsed
    .filter((r) => !r.draft && r.published_at)
    .map((r) => ({
      id: r.id,
      tag: r.tag_name,
      title: r.name?.trim() || r.tag_name,
      channel: channelOf(r.tag_name, r.prerelease),
      line: lineOf(r.tag_name),
      publishedAt: r.published_at!,
      url: r.html_url,
      body: r.body ?? "",
    }))
    .sort((a, b) => compareVersions(b.tag, a.tag));

  memo = { releases, byTag: new Map(releases.map((r) => [r.tag, r])) };
  return memo;
}

export const getReleases = cache((): Release[] => load().releases);

export const getRelease = cache(
  (tag: string): Release | undefined => load().byTag.get(tag),
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
