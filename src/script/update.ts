import { dbClient, dbSchema } from "@/db";
import { releaseSchema } from "@/lib/schema";
import { booleanToNumber } from "@/lib/utils";
import { Octokit } from "@octokit/rest";
import { count, desc } from "drizzle-orm";

const octokit = new Octokit({
  auth: process.env.OCTOKIT_TOKEN,
});

const fetchReleases = async () => {
  await dbClient.delete(dbSchema.releases);
  const checkLatest = await dbClient
    .select()
    .from(dbSchema.releases)
    .orderBy(desc(dbSchema.releases.created_at))
    .limit(1);

  let isNeedUpdate = true;

  let page = 1;
  while (true) {
    const resp = await fetchReleasePage(page);
    if (!resp) {
      break;
    }

    if (page === 1 && resp[0].name === checkLatest[0]?.name) {
      console.log("No new releases");
      console.log(`Latest release: ${resp[0].name}`);
      isNeedUpdate = false;
      break;
    }

    if (page === 1 && isNeedUpdate) {
      console.log("Start fetching releases");
      const clearDB = await dbClient.delete(dbSchema.releases);
      console.log("Database cleared");
    }

    if (isNeedUpdate) {
      await dbClient.insert(dbSchema.releases).values(
        resp.map((r) => {
          return {
            name: r.name,
            url: r.url,
            assets_url: r.assets_url,
            upload_url: r.upload_url,
            html_url: r.html_url,
            id: r.id,
            assets: r.assets,
            tarball_url: r.tarball_url,
            author: r.author,
            node_id: r.node_id,
            tag_name: r.tag_name,
            target_commitish: r.target_commitish,
            body: r.body,
            draft: booleanToNumber(r.draft),
            prerelease: booleanToNumber(r.prerelease),
            created_at: r.created_at,
            published_at: r.published_at,
            zipball_url: r.zipball_url,
            reactions: r.reactions,
            mentions_count: r.mentions_count,
          };
        }),
      );
      console.log(`Page ${page} inserted`);
    }

    page++;
  }

  const releasesCount = await dbClient
    .select({
      count: count(dbSchema.releases.id),
    })
    .from(dbSchema.releases);
  const latestRelease = await dbClient
    .select()
    .from(dbSchema.releases)
    .orderBy(desc(dbSchema.releases.created_at))
    .limit(1);

  if (isNeedUpdate) {
    console.log(`Total releases: ${releasesCount[0].count}`);
    console.log("Done");
    console.log(`Latest release: ${latestRelease[0].name}`);
  }
};

const fetchReleasePage = async (page: number) => {
  console.log(`Fetching page ${page}`);

  const { data: resp } = await octokit.rest.repos.listReleases({
    owner: "vercel",
    repo: "next.js",
    per_page: 100,
    page,
  });

  const parsedData = releaseSchema.safeParse(resp);

  if (!parsedData.success) {
    console.log(`Error parsing data: ${parsedData.error}`);
    return null;
  }

  return resp.length === 0 ? null : parsedData.data;
};

fetchReleases();
