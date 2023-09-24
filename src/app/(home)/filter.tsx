"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useQueryParam, StringParam, withDefault } from "use-query-params";

export function FilterButton() {
  const [filter, setFiler] = useQueryParam(
    "filter",
    withDefault(StringParam, ""),
  );

  const isPreRelease = filter === "pre-release";
  const isRelease = filter === "release";

  return (
    <div className="flex space-x-4">
      <Button
        size="sm"
        variant={isPreRelease ? "default" : "secondary"}
        onClick={() => {
          if (isPreRelease) {
            setFiler("");
          } else {
            setFiler("pre-release");
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
            setFiler("");
          } else {
            setFiler("release");
          }
        }}
      >
        Release
      </Button>
    </div>
  );
}

export const FilterInput = () => {
  const [search, setSearch] = useQueryParam(
    "search",
    withDefault(StringParam, ""),
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  return (
    <div className="w-fit">
      <Input placeholder="Search version" onChange={onChange} />
    </div>
  );
};
