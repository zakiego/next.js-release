"use client";
import { Transition } from "@headlessui/react";

import { ReleaseSchema } from "@/app/(home)/schema";
import { Fragment, useState } from "react";

import { match } from "ts-pattern";
import ReactMarkdown from "react-markdown";
import { groupByVersion } from "@/app/(home)/utils";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface TableProps {
  data: ReleaseSchema;
}

export default function Table({ data }: TableProps) {
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
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Next.js Releases
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of releases for the Next.js framework.
          </p>
          <div className="mt-8 flex space-x-4">
            <ReleaseType type="Pre-release" />
            <ReleaseType type="Release" />
          </div>
        </div>
      </div>
      <p></p>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Version
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Published
                  </th>

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
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
                        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        {group.version}
                      </th>
                    </tr>
                    {group.releases.map((item, itemIdx) => (
                      <Fragment key={item.name}>
                        <tr
                          className={classNames(
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
                              .with({ prerelease: false, draft: false }, () => (
                                <ReleaseType type="Release" />
                              ))
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
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <button
                              // href={item.html_url}
                              // target="_blank"
                              // rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                updateMap({
                                  groupId: groupIdx,
                                  releaseId: itemIdx,
                                  v: !getMap({
                                    groupId: groupIdx,
                                    releaseId: itemIdx,
                                  }),
                                })
                              }
                            >
                              View
                              <span className="sr-only">, {item.html_url}</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <Transition
                            show={Boolean(
                              getMap({
                                groupId: groupIdx,
                                releaseId: itemIdx,
                              }),
                            )}
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
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ring-1 ring-inset ${color}`}
    >
      {type}
    </span>
  );
}

{
  /* <tr>
                          <div className="prose bg-red-400 w-full h-20 columns-2">
                            <ReactMarkdown>{item.body}</ReactMarkdown>
                          </div>
                        </tr> */
}
