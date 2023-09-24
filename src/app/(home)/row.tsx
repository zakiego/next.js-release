"use client";

import { GroupByVersion, classNames } from "@/app/(home)/utils";

import { match } from "ts-pattern";
import ReactMarkdown from "react-markdown";
import { Fragment, useState } from "react";

interface RowProps {
  data: GroupByVersion[number];
}

export const Row = ({ data }: RowProps) => {
  const [isShowContent, setIsShowContent] = useState(false);

  return (
    <Fragment key={data.version}>
      <tr className="border-t border-gray-200">
        <th
          colSpan={5}
          scope="colgroup"
          className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
        >
          {data.version}
        </th>
      </tr>
      {data.releases.map((item, itemIdx) => (
        <Fragment key={item.name}>
          <tr
            className={classNames(
              itemIdx === 0 ? "border-gray-300" : "border-gray-200",
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
                .with({ prerelease: false, draft: false }, () => (
                  <ReleaseType type="Release" />
                ))
                .with({ prerelease: true }, () => (
                  <ReleaseType type="Pre-release" />
                ))
                .with({ draft: true }, () => <ReleaseType type="Draft" />)
                .otherwise(() => {
                  throw new Error("Unknown release type");
                })}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {new Date(item.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
              <button
                // href={item.html_url}
                // target="_blank"
                // rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-900"
                onClick={() => setIsShowContent(!isShowContent)}
              >
                View
                <span className="sr-only">, {item.html_url}</span>
              </button>
            </td>
          </tr>
          {/* Add a new row with one column below */}
          <tr
            className={classNames(
              ["border-t border-gray-200"],
              `${isShowContent ? "block" : "hidden"}`,
            )}
          >
            <td colSpan={5} className="prose">
              <ReactMarkdown>{item.body}</ReactMarkdown>
            </td>
          </tr>
        </Fragment>
      ))}
    </Fragment>
  );
};

function ReleaseType({ type }: { type: "Release" | "Draft" | "Pre-release" }) {
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
      className={`inline-flex  items-center rounded-md  px-2 py-1 text-xs font-medium ring-1 ring-inset ${color}`}
    >
      {type}
    </span>
  );
}
