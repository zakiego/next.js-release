// Shared release helpers. Safe to import from client and server code.

export const CHANNELS = ["stable", "canary", "rc", "beta", "preview"] as const;
export type Channel = (typeof CHANNELS)[number];

export type ReleaseSummary = {
  tag: string;
  channel: Channel;
  line: string;
  publishedAt: string;
};

type ParsedVersion = {
  major: number;
  minor: number;
  patch: number;
  channel: Channel;
  preNumber: number;
};

const VERSION_RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)(?:\.(\d+))?)?$/i;

// Lower rank sorts first among prereleases of the same version.
const PRE_RANK: Record<Channel, number> = {
  canary: 0,
  preview: 1,
  beta: 2,
  rc: 3,
  stable: 4,
};

export function parseVersion(tag: string): ParsedVersion | null {
  const match = VERSION_RE.exec(tag.trim());
  if (!match) return null;
  const [, major, minor, patch, pre, preNumber] = match;
  const label = pre?.toLowerCase();
  const channel: Channel = !label
    ? "stable"
    : (CHANNELS as readonly string[]).includes(label)
      ? (label as Channel)
      : "canary";
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    channel,
    preNumber: preNumber ? Number(preNumber) : 0,
  };
}

export function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return pa ? 1 : pb ? -1 : a.localeCompare(b);
  return (
    pa.major - pb.major ||
    pa.minor - pb.minor ||
    pa.patch - pb.patch ||
    PRE_RANK[pa.channel] - PRE_RANK[pb.channel] ||
    pa.preNumber - pb.preNumber
  );
}

export function lineOf(tag: string): string {
  const parsed = parseVersion(tag);
  return parsed ? `v${parsed.major}.${parsed.minor}` : "Other";
}

export function channelOf(tag: string, prerelease: boolean): Channel {
  const parsed = parseVersion(tag);
  if (parsed) return parsed.channel;
  return prerelease ? "canary" : "stable";
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  stable: "Stable",
  canary: "Canary",
  rc: "RC",
  beta: "Beta",
  preview: "Preview",
};

// Normalizes "16.5", "v16.5" and "V16.5 " to the same search key.
export function normalizeQuery(value: string): string {
  return value.trim().toLowerCase().replace(/^v/, "");
}

export function matchesQuery(tag: string, query: string): boolean {
  if (!query) return true;
  return tag.toLowerCase().replace(/^v/, "").includes(query);
}

export type ReleaseGroup = { line: string; releases: ReleaseSummary[] };

export function groupByLine(releases: ReleaseSummary[]): ReleaseGroup[] {
  const groups: ReleaseGroup[] = [];
  const index = new Map<string, ReleaseGroup>();
  for (const release of releases) {
    let group = index.get(release.line);
    if (!group) {
      group = { line: release.line, releases: [] };
      index.set(release.line, group);
      groups.push(group);
    }
    group.releases.push(release);
  }
  return groups;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export function formatRelative(iso: string, now: number): string {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return relativeFormatter.format(Math.round(seconds / size), unit);
    }
  }
  return "just now";
}

export function releaseHref(tag: string): string {
  return `/releases/${encodeURIComponent(tag)}`;
}

/** Rows shown per page on the board. */
export const PAGE_SIZE = 50;

export const SITE_URL = "https://next-js-release.vercel.app";
export const SITE_NAME = "Next.js Releases";
export const REPO_URL = "https://github.com/zakiego/next.js-release";
