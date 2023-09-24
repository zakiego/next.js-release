import { releaseSchema } from "@/app/(home)/schema";
import Table from "@/app/(home)/table";
import { Metadata } from "next";

export const fetchCache = "force-cache";

export const metadata: Metadata = {
  title: "Next.js Releases",
  description: "A list of releases for the Next.js framework.",
};

const fetchAllReleases = async () => {
  let releases: any[] = [];

  const fetchRelease = async (page: number) => {
    const resp = await fetch(
      `https://api.github.com/repos/vercel/next.js/releases?page=${page}&per_page=100`,
    ).then((resp) => resp.json());

    if (!resp.length) {
      console.log("Done");
      console.log(resp);
      return;
    }

    if (resp.length) {
      releases = [...releases, ...resp];
      await fetchRelease(page + 1);
    }
  };

  await fetchRelease(1);

  return releases;
};

export default async function Home() {
  const resp = await fetchAllReleases();

  let data = releaseSchema.parse(resp);

  return (
    <main className="container mx-auto sm:px-6 lg:px-8">
      <div className="mt-8">
        <Table data={data} dataLength={data.length} />
      </div>
    </main>
  );
}
