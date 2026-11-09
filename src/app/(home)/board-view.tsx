"use client";

import { PanelRightOpenIcon, SearchIcon, SearchXIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { forwardRef, Fragment } from "react";
import { ChannelBadge, NewestMark } from "@/components/release/channel-badge";
import { prefetchNotes } from "@/components/release/notes-store";
import { RelativeTime } from "@/components/release/relative-time";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  formatDate,
  formatShortDate,
  PAGE_SIZE,
  releaseHref,
  type ReleaseGroup,
  type ReleaseSummary,
} from "@/lib/release";

export const CHANNEL_FILTERS = ["all", "stable", "prerelease"] as const;
export type ChannelFilter = (typeof CHANNEL_FILTERS)[number];

const FILTER_LABEL: Record<ChannelFilter, string> = {
  all: "All",
  stable: "Stable",
  prerelease: "Pre-release",
};

const numberFormat = new Intl.NumberFormat("en-US");

// Pre-release tags already spell out their channel ("-canary.44", "-rc.1").
// On phones, where the Channel column is hidden, only stable rows need a badge.
function tagNamesChannel(release: ReleaseSummary) {
  return release.tag.toLowerCase().includes(`-${release.channel}`);
}

export type BoardViewProps = {
  groups: ReleaseGroup[];
  lineCounts: Record<string, number>;
  channelCounts: Record<ChannelFilter, number>;
  query: string;
  channel: ChannelFilter;
  shown: number;
  matching: number;
  newestTag: string | undefined;
  onQueryChange?: (value: string) => void;
  onChannelChange?: (value: ChannelFilter) => void;
  onShowMore?: () => void;
  onOpenNotes?: (tag: string) => void;
  onReset?: () => void;
};

export const BoardView = forwardRef<HTMLInputElement, BoardViewProps>(
  function BoardView(
    {
      groups,
      lineCounts,
      channelCounts,
      query,
      channel,
      shown,
      matching,
      newestTag,
      onQueryChange,
      onChannelChange,
      onShowMore,
      onOpenNotes,
      onReset,
    },
    searchRef,
  ) {
    const interactive = Boolean(onQueryChange);

    return (
      <section
        aria-labelledby="board-heading"
        className="flex flex-col"
      >
        <h2 id="board-heading" className="sr-only">
          All releases
        </h2>

        <div
          role="search"
          className="sticky top-0 z-20 -mx-4 flex flex-col gap-2 bg-background px-4 py-3 sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <InputGroup className="sm:max-w-xs">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Search versions"
              placeholder="Search, e.g. 15.3"
              value={query}
              readOnly={!interactive}
              onChange={(e) => onQueryChange?.(e.target.value)}
              className="font-mono text-base sm:text-sm"
            />
            <InputGroupAddon align="inline-end">
              {query ? (
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear search"
                  onClick={() => onQueryChange?.("")}
                >
                  <XIcon />
                </InputGroupButton>
              ) : (
                <Kbd className="max-sm:hidden">/</Kbd>
              )}
            </InputGroupAddon>
          </InputGroup>

          <ToggleGroup
            type="single"
            variant="outline"
            value={channel}
            onValueChange={(value) =>
              value && onChannelChange?.(value as ChannelFilter)
            }
            aria-label="Filter by channel"
            className="w-full sm:w-auto"
          >
            {CHANNEL_FILTERS.map((value) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="flex-1 gap-1.5 px-3 sm:flex-none"
              >
                {FILTER_LABEL[value]}
                <span className="tabular font-mono text-xs text-muted-foreground max-sm:hidden">
                  {numberFormat.format(channelCounts[value])}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <p className="sr-only" aria-live="polite">
          {matching === 0
            ? "No releases match."
            : `${numberFormat.format(matching)} releases match.`}
        </p>

        {matching === 0 ? (
          <Empty className="my-10 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchXIcon />
              </EmptyMedia>
              <EmptyTitle>
                {query ? (
                  <>
                    No releases match{" "}
                    <span className="font-mono break-all">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  "No releases in this channel"
                )}
              </EmptyTitle>
              <EmptyDescription>
                Search by version number, like 15.3 or 16.0.0-canary.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={onReset}>
                Clear search and filters
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table containerClassName="overflow-x-visible">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-full pl-0 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Version</TableHead>
                <TableHead className="w-28 max-sm:hidden font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Channel</TableHead>
                <TableHead className="w-28 text-right sm:w-32 sm:text-left font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Published</TableHead>
                <TableHead className="w-28 max-md:hidden font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Age</TableHead>
                <TableHead className="w-12 pr-0 md:w-24">
                  <span className="sr-only">Notes</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <Fragment key={group.line}>
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead
                      colSpan={5}
                      scope="colgroup"
                      className="sticky top-[calc(var(--board-band-top)-1px)] z-10 h-9 bg-background px-0"
                    >
                      <span className="flex items-baseline gap-2 border-b pb-1.5 pt-2">
                        <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
                          {group.line}
                        </span>
                        <span className="tabular font-mono text-[11px] font-normal tracking-wide text-muted-foreground uppercase">
                          {numberFormat.format(lineCounts[group.line] ?? 0)}{" "}
                          {lineCounts[group.line] === 1 ? "release" : "releases"}
                        </span>
                      </span>
                    </TableHead>
                  </TableRow>
                  {group.releases.map((release) => (
                    <TableRow key={release.tag} className="group/row">
                      <TableCell className="py-1.5 pl-0 whitespace-normal">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Link
                            href={releaseHref(release.tag)}
                            translate="no"
                            className="rounded-sm font-mono font-medium tracking-tight whitespace-nowrap underline-offset-4 hover:underline"
                          >
                            {release.tag}
                          </Link>
                          {release.tag === newestTag && <NewestMark />}
                          {!tagNamesChannel(release) && (
                            <span className="sm:hidden">
                              <ChannelBadge channel={release.channel} />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5 max-sm:hidden">
                        <ChannelBadge channel={release.channel} />
                      </TableCell>
                      <TableCell className="tabular py-1.5 text-right font-mono text-[13px] text-muted-foreground sm:text-left">
                        <time dateTime={release.publishedAt}>
                          <span className="max-[22.5rem]:hidden">
                            {formatDate(release.publishedAt)}
                          </span>
                          <span className="hidden max-[22.5rem]:inline">
                            {formatShortDate(release.publishedAt)}
                          </span>
                        </time>
                      </TableCell>
                      <TableCell className="tabular py-1.5 font-mono text-[13px] text-muted-foreground max-md:hidden">
                        <RelativeTime iso={release.publishedAt} />
                      </TableCell>
                      <TableCell className="py-1 pr-0 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Read notes for ${release.tag}`}
                          onClick={() => onOpenNotes?.(release.tag)}
                          {...(interactive && {
                            onPointerEnter: () => prefetchNotes(release.tag),
                            onPointerDown: () => prefetchNotes(release.tag),
                            onFocus: () => prefetchNotes(release.tag),
                          })}
                          asChild={!interactive}
                        >
                          {interactive ? (
                            <>
                              <PanelRightOpenIcon data-icon="inline-start" />
                              <span className="max-md:sr-only">Notes</span>
                            </>
                          ) : (
                            <Link href={releaseHref(release.tag)}>
                              <PanelRightOpenIcon data-icon="inline-start" />
                              <span className="max-md:sr-only">Notes</span>
                            </Link>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}

        {matching > 0 && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="tabular text-sm text-muted-foreground">
              Showing {numberFormat.format(Math.min(shown, matching))} of{" "}
              {numberFormat.format(matching)}
            </p>
            {shown < matching && (
              <Button variant="outline" onClick={onShowMore}>
                Show {numberFormat.format(Math.min(PAGE_SIZE, matching - shown))} more
              </Button>
            )}
          </div>
        )}
      </section>
    );
  },
);
