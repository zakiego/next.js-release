import Table from "@/app/(home)/table";
import { Metadata } from "next";
import { dbClient, dbSchema } from "@/db";
import { releaseSchema } from "@/lib/schema";
import { and, desc, eq, like } from "drizzle-orm";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
	title: "Next.js Releases",
	description: "A list of releases for the Next.js framework.",
};

interface Props {
	searchParams: {
		filter: "pre-release" | "release" | undefined;
		search: string | undefined;
		show: string | undefined;
	};
}

export default async function Home(props: Props) {
	const { searchParams } = props;

	const selectQuery = dbClient
		.select()
		.from(dbSchema.releases)
		.orderBy(desc(dbSchema.releases.published_at))
		.where(
			and(
				searchParams.search
					? like(dbSchema.releases.name, `%${searchParams.search}%`)
					: undefined,
				searchParams.filter === "pre-release"
					? eq(dbSchema.releases.prerelease, 1)
					: undefined,
				searchParams.filter === "release"
					? and(
							eq(dbSchema.releases.prerelease, 0),
							eq(dbSchema.releases.draft, 0),
					  )
					: undefined,
			),
		)
		.limit(searchParams.show ? parseInt(searchParams.show) + 1 : 31);

	const cacheKey = `${searchParams.filter}-${searchParams.search}-${searchParams.show}`;

	const selectQueryCached = unstable_cache(
		async () => selectQuery.execute(),
		[cacheKey],
	);

	const resp = await selectQueryCached();

	const data = releaseSchema.parse(resp);
	const formatBody = data.map((release) => {
		return {
			...release,
			body: remark()
				.use(remarkGfm)
				.use(remarkGithub, {
					repository: "vercel/next.js",
				})
				.processSync(release.body)
				.toString(),
		};
	});

	return (
		<main className="container mx-auto sm:px-6 lg:px-8">
			<div className="mt-8">
				<Table data={formatBody} dataLength={data.length} />
			</div>
		</main>
	);
}
