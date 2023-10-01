import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.OCTOKIT_TOKEN,
});

export const saveToJson = async (data: any, path: string) => {
  try {
    await Bun.write(path, JSON.stringify(data, null, 2));
    console.log(`Successfully saved to ${path}`);
  } catch (error) {
    console.log(`Error saving to ${path}`);
    console.log(`Error: ${error}`);
  }
};

type ReleaseData = Awaited<
  ReturnType<typeof octokit.rest.repos.listReleases>
>["data"][number];

const getLatestReleaseData = async () => {
  const latestRelease = Bun.file("/public/data.json");
  return await latestRelease.json();
};

const fetchReleases = async () => {
  const latestReleaseData = await getLatestReleaseData();
  if (!latestReleaseData) {
    console.log("No latest release data found");
    return;
  }

  let releases: ReleaseData[] = [];
  let isNeedUpdate = true;

  let page = 1;
  while (true) {
    const resp = await fetchReleasePage(page);
    if (!resp) {
      break;
    }

    if (page === 1 && resp[0].name === latestReleaseData[0].name) {
      console.log("No new releases");
      console.log(`Latest release: ${resp[0].name}`);
      isNeedUpdate = false;
      break;
    }

    if (isNeedUpdate) {
      releases.push(...resp);
    }

    page++;
  }

  if (isNeedUpdate && releases.length > 0) {
    console.log(`Total releases: ${releases.length}`);
    console.log("Done");
    console.log(`Latest release: ${releases[0].name}`);
    await saveToJson(releases, "/public/data.json");
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

  return resp.length === 0 ? null : resp;
};

fetchReleases();
