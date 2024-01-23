"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	StringParam,
	withDefault,
	useQueryParams,
	NumberParam,
} from "use-query-params";

export function FilterButton() {
	const [query, setQuery] = useQueryParams({
		filter: withDefault(StringParam, ""),
		show: withDefault(NumberParam, 30),
	});

	const isPreRelease = query.filter === "pre-release";
	const isRelease = query.filter === "release";

	return (
		<div className="flex space-x-4">
			<Button
				size="sm"
				variant={isPreRelease ? "default" : "secondary"}
				onClick={() => {
					if (isPreRelease) {
						setQuery({ filter: "", show: 30 });
					} else {
						setQuery({ filter: "pre-release", show: 30 });
					}
				}}
			>
				Pre-release
			</Button>
			<Button
				size="sm"
				variant={isRelease ? "default" : "secondary"}
				onClick={() => {
					if (isRelease) {
						setQuery({ filter: "", show: 30 });
					} else {
						setQuery({ filter: "release", show: 30 });
					}
				}}
			>
				Release
			</Button>
		</div>
	);
}

export const FilterInput = () => {
	const [query, setQuery] = useQueryParams({
		search: withDefault(StringParam, ""),
		show: withDefault(NumberParam, 30),
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTimeout(() => {
			setQuery({ search: e.target.value, show: 30 });
		}, 500);
	};

	return (
		<div className="w-full md:w-fit mt-4 md:mt-0">
			<Input placeholder="Search version" onChange={onChange} />
		</div>
	);
};
