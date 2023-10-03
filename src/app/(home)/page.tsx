import { releaseSchema } from "@/app/(home)/schema";
import Table from "@/app/(home)/table";
import { Metadata } from "next";
import * as fs from "fs";
export const fetchCache = "force-cache";

export const metadata: Metadata = {
  title: "Next.js Releases",
  description: "A list of releases for the Next.js framework.",
};

const fetchAllReleases = async () => {
  const releases = await fs.readFileSync("./public/data.json", "utf-8");

  return JSON.parse(releases);
};

export default async function Home() {
  const resp = await fetchAllReleases();

  const data = await releaseSchema.parseAsync(resp);

  return (
    <main className="container mx-auto sm:px-6 lg:px-8">
      <div className="mt-8">
        <Table data={data} dataLength={data.length} />
      </div>
    </main>
  );
}
