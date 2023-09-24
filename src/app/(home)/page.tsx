import { releaseSchema } from "@/app/(home)/schema";
import Table from "@/app/(home)/table";
import { Metadata } from "next";

interface Props {
  searchParams: {
    filter?: string;
    search?: string;
  };
}

export const metadata: Metadata = {
  title: "Next.js Releases",
  description: "A list of releases for the Next.js framework.",
};

const fetchAllReleases = async () => {
  let releases: any[] = [];

  const fetchRelease = async (page: number) => {
    const resp = await fetch(
      `https://api.github.com/repos/vercel/next.js/releases?page=${page}&per_page=100`,
      {
        cache: "force-cache",
      },
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

export default async function Home({ searchParams }: Props) {
  const { filter, search } = searchParams;

  const resp = await fetchAllReleases();

  let data = releaseSchema.parse(resp);

  if (filter) {
    if (filter === "pre-release") {
      data = data.filter((v) => v.prerelease);
    }

    if (filter === "release") {
      data = data.filter((v) => !v.prerelease && !v.draft);
    }
  }

  if (search) {
    data = data.filter((v) => v.name.includes(search));
  }

  return (
    <main className="container mx-auto sm:px-6 lg:px-8">
      <div className="mt-8">
        <Table data={data} />
      </div>
    </main>
  );
}
