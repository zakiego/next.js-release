// Fetches Next.js releases from GitHub and stores the fields the site uses in
// public/data.json. Runs hourly from .github/workflows/update.yml.
import { Octokit } from "@octokit/rest";

const DATA_PATH = "./public/data.json";
const PER_PAGE = 100;

const octokit = new Octokit({ auth: process.env.OCTOKIT_TOKEN });

type GitHubRelease = Awaited<
  ReturnType<typeof octokit.rest.repos.listReleases>
>["data"][number];

export type StoredRelease = {
  id: number;
  tag_name: string;
  name: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
  published_at: string | null;
  body: string;
};

function slim(release: GitHubRelease): StoredRelease {
  return {
    id: release.id,
    tag_name: release.tag_name,
    name: release.name ?? "",
    html_url: release.html_url,
    prerelease: release.prerelease,
    draft: release.draft,
    published_at: release.published_at,
    body: release.body ?? "",
  };
}

async function readStored(): Promise<StoredRelease[]> {
  const file = Bun.file(DATA_PATH);
  if (!(await file.exists())) return [];
  const raw = (await file.json()) as Array<StoredRelease & Partial<GitHubRelease>>;
  // Older files hold full GitHub objects, so slim them on read.
  return raw.map((r) => slim(r as GitHubRelease));
}

async function fetchPage(page: number) {
  console.log(`Fetching page ${page}`);
  const { data } = await octokit.rest.repos.listReleases({
    owner: "vercel",
    repo: "next.js",
    per_page: PER_PAGE,
    page,
  });
  return data.map(slim);
}

// A full refresh walks every page (about 40 requests), so edited notes on
// old releases and deleted releases reach the site. The hourly run stops
// at the first page it already knows; the workflow runs --full once a day.
const FULL = process.argv.includes("--full");

// If a full walk comes back much smaller than what we have, GitHub most
// likely returned a partial list. Keep the stored data rather than drop it.
const MIN_FULL_RATIO = 0.95;

async function main() {
  const stored = await readStored();
  const known = new Map(stored.map((r) => [r.id, r]));
  const fetched: StoredRelease[] = [];

  // Incremental: walk pages until one overlaps what we already have. A full
  // page of unknown releases means we may still be behind, so keep going.
  for (let page = 1; ; page++) {
    const releases = await fetchPage(page);
    fetched.push(...releases);
    if (releases.length < PER_PAGE) break;
    if (!FULL && releases.some((r) => known.has(r.id))) break;
  }

  let merged: StoredRelease[];
  if (FULL) {
    if (fetched.length < stored.length * MIN_FULL_RATIO) {
      throw new Error(
        `Full refresh returned ${fetched.length} releases, but ${stored.length} are stored. Refusing to drop them.`,
      );
    }
    const fetchedIds = new Set(fetched.map((r) => r.id));
    const removed = stored.filter((r) => !fetchedIds.has(r.id));
    if (removed.length) {
      console.log(`Removing ${removed.length} deleted: ${removed.map((r) => r.tag_name).join(", ")}`);
    }
    merged = fetched;
  } else {
    const fetchedIds = new Set(fetched.map((r) => r.id));
    merged = [...fetched, ...stored.filter((r) => !fetchedIds.has(r.id))];
  }

  const next = JSON.stringify(merged, null, 2) + "\n";
  const current = (await Bun.file(DATA_PATH).exists())
    ? await Bun.file(DATA_PATH).text()
    : "";

  if (next === current) {
    console.log(`No changes. Latest release: ${merged[0]?.tag_name}`);
    return;
  }

  await Bun.write(DATA_PATH, next);
  const added = fetched.filter((r) => !known.has(r.id)).length;
  console.log(
    `Saved ${merged.length} releases (${added} new). Latest: ${merged[0]?.tag_name}`,
  );
}

await main();
