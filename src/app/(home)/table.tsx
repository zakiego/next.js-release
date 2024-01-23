"use client";
import { Transition } from "@headlessui/react";

import { Fragment, useState } from "react";
import queryString from "query-string";

import { match } from "ts-pattern";
import ReactMarkdown from "react-markdown";
import { groupByVersion } from "@/app/(home)/utils";
import { FilterButton, FilterInput } from "@/app/(home)/filter";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";
import {
	NumberParam,
	StringParam,
	useQueryParams,
	withDefault,
} from "use-query-params";
import { useRouter } from "next/navigation";
import { ReleaseSchema } from "@/lib/schema";

interface TableProps {
	data: ReleaseSchema;
	dataLength: number;
}

export default function Table({ data, dataLength }: TableProps) {
	const router = useRouter();

	const [query, setQuery] = useQueryParams({
		filter: StringParam,
		search: StringParam,
		show: withDefault(NumberParam, 30),
	});

	data = data.slice(0, query.show);

	const groupedData = groupByVersion(data);

	const [isShowContent, setIsShowContent] = useState(new Map());

	const updateMap = ({
		groupId,
		releaseId,
		v,
	}: {
		groupId: number;
		releaseId: number;
		v: boolean;
	}) => {
		setIsShowContent(new Map(isShowContent.set(`${groupId}-${releaseId}`, v)));
	};

	const getMap = ({
		groupId,
		releaseId,
	}: {
		groupId: number;
		releaseId: number;
	}): boolean => isShowContent.get(`${groupId}-${releaseId}`);

	return (
		<div className="">
			<div className="flex justify-between items-start">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-4xl font-extrabold text-gray-900">
							<Balancer>Next.js Releases</Balancer>
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							<Balancer>A list of releases for the Next.js framework.</Balancer>
						</p>
					</div>
				</div>
				<a
					href="https://github.com/zakiego/next.js-release"
					className="opacity-80 hover:opacity-90"
				>
					<FaGithub size="2.6rem" />
				</a>
			</div>
			<div className="mt-8 md:mt-4 flex flex-col-reverse md:flex-row md:justify-between md:items-center ">
				<FilterInput />
				<FilterButton />
			</div>

			<div className="mt-4 flow-root pb-10">
				<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full border-separate border-spacing-0">
							<thead className="bg-white">
								<tr>
									<th
										scope="col"
										className="border-b-[1px] sticky top-0 z-10 bg-opacity-75 backdrop-blur backdrop-filter py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
										// className="sm:pl-6 lg:pl-8"
									>
										Version
									</th>
									<th
										scope="col"
										className="border-b-[1px] sticky top-0 z-10 bg-opacity-75 backdrop-blur backdrop-filter  px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Type
									</th>
									<th
										scope="col"
										className="border-b-[1px] sticky top-0 z-10 bg-opacity-75 backdrop-blur backdrop-filter  px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Published
									</th>

									<th
										scope="col"
										className="border-b-[1px] sticky top-0 z-10 bg-opacity-75 backdrop-blur backdrop-filter py-3.5"
									>
										<span className="sr-only">Edit</span>
									</th>
								</tr>
							</thead>
							<tbody className="bg-white">
								{groupedData.map((group, groupIdx) => (
									<Fragment key={group.version}>
										<tr className="border-t border-gray-200">
											<th
												colSpan={5}
												scope="colgroup"
												className="
                        border-b-[1px] sticky top-12 z-10 bg-opacity-75 backdrop-blur backdrop-filter
                        bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
											>
												{group.version}
											</th>
										</tr>
										{group.releases.map((item, itemIdx) => {
											const isOpen = Boolean(
												getMap({
													groupId: groupIdx,
													releaseId: itemIdx,
												}),
											);

											return (
												<Fragment key={item.name}>
													<tr
														className={cn(
															itemIdx === 0
																? "border-gray-300"
																: "border-gray-200",
															"border-t",
														)}
													>
														<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
															{item.name}
														</td>
														<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
															{match({
																prerelease: item.prerelease,
																draft: item.draft,
															})
																.with(
																	{ prerelease: false, draft: false },
																	() => <ReleaseType type="Release" />,
																)
																.with({ prerelease: true }, () => (
																	<ReleaseType type="Pre-release" />
																))
																.with({ draft: true }, () => (
																	<ReleaseType type="Draft" />
																))
																.otherwise(() => {
																	throw new Error("Unknown release type");
																})}
														</td>
														<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
															{new Date(item.published_at).toLocaleDateString(
																"en-US",
																{
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																},
															)}
														</td>
														<td className="flex justify-center items-center space-x-2 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
															<Button
																className="text-slate-600 hover:text-slate-900"
																onClick={() =>
																	updateMap({
																		groupId: groupIdx,
																		releaseId: itemIdx,
																		v: !isOpen,
																	})
																}
																variant="ghost"
															>
																{isOpen ? <EyeSlash /> : <EyeIcon />}
															</Button>
															<a
																href={item.html_url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-slate-600 hover:text-slate-900 "
															>
																<Button variant="ghost">
																	<ArrowUpRight />
																</Button>
															</a>
														</td>
													</tr>
													<tr>
														<Transition
															show={isOpen}
															enter="transition-opacity duration-150"
															enterFrom="opacity-0"
															enterTo="opacity-100"
															leave="transition-opacity duration-50"
															leaveFrom="opacity-100"
															leaveTo="opacity-0"
															as="td"
															colSpan={5}
															className="prose table-fixed py-3"
														>
															<ReactMarkdown>{item.body}</ReactMarkdown>
														</Transition>
													</tr>
												</Fragment>
											);
										})}
									</Fragment>
								))}
							</tbody>
						</table>

						{query.show < dataLength && (
							<div className="justify-center items-center flex flex-col">
								<Button
									size="sm"
									onClick={() => {
										const newQuery = queryString.stringify(
											{
												...query,
												show: query.show + 20,
											},
											{
												skipNull: true,
											},
										);

										router.push(`/?${newQuery}`, {
											scroll: false,
										});
									}}
								>
									Show more...
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ReleaseType({
	type,
}: {
	type: "Release" | "Draft" | "Pre-release";
}) {
	const color = match(type)
		.with("Release", () => "bg-green-50  text-green-700  ring-green-600/20")
		.with("Draft", () => "bg-gray-50 text-gray-700 ring-gray-600/20")
		.with(
			"Pre-release",
			() => "ring-orange-600/20 text-orange-700 bg-orange-50",
		)
		.exhaustive();

	return (
		<span
			className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ring-1 ring-inset ${color}`}
		>
			{type}
		</span>
	);
}

const EyeIcon = () => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
	</svg>
);

const EyeSlash = () => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
		/>
	</svg>
);

const ArrowUpRight = () => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-4 h-4"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
		/>
	</svg>
);
