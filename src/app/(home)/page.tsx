import { releaseSchema } from "@/app/(home)/schema";
import Table from "@/app/(home)/table";

export default async function Home() {
  const resp = await fetch(
    "https://api.github.com/repos/vercel/next.js/releases?page=1&per_page=30",
  ).then((resp) => resp.json());

  const data = releaseSchema.parse(resp);

  return (
    <main className="container mx-auto sm:px-6 lg:px-8">
      <div className="mt-8">
        <Table data={data} />
      </div>
    </main>
  );
}
