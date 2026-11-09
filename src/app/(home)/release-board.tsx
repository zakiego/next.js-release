"use client";

import {
  debounce,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import dynamic from "next/dynamic";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  BoardView,
  CHANNEL_FILTERS,
  type ChannelFilter,
} from "@/app/(home)/board-view";
import {
  groupByLine,
  matchesQuery,
  normalizeQuery,
  PAGE_SIZE,
  type ReleaseSummary,
  unpackSummaries,
} from "@/lib/release";

// The sheet (Radix Dialog and its focus and scroll handling) loads the first
// time notes open, or earlier when prefetchNotes runs on hover or focus.
const NotesSheet = dynamic(
  () => import("@/components/release/notes-sheet").then((m) => m.NotesSheet),
  { ssr: false },
);

const boardParams = {
  q: parseAsString.withDefault(""),
  channel: parseAsStringLiteral(CHANNEL_FILTERS).withDefault("all"),
  show: parseAsInteger.withDefault(PAGE_SIZE),
  notes: parseAsString,
};

function inChannel(release: ReleaseSummary, channel: ChannelFilter) {
  if (channel === "all") return true;
  return channel === "stable"
    ? release.channel === "stable"
    : release.channel !== "stable";
}

export function ReleaseBoard({
  packed,
  newestTag,
}: {
  /** Every release, packed by `packSummaries` to keep the page payload small. */
  packed: string;
  newestTag: string | undefined;
}) {
  const releases = useMemo(() => unpackSummaries(packed), [packed]);
  const [{ q, channel, show, notes }, setParams] = useQueryStates(boardParams, {
    history: "replace",
    scroll: false,
  });
  const searchRef = useRef<HTMLInputElement>(null);

  // Mount the sheet on first open and keep it, so closing still animates out.
  const [sheetMounted, setSheetMounted] = useState(notes !== null);
  if (notes !== null && !sheetMounted) setSheetMounted(true);

  const query = normalizeQuery(useDeferredValue(q));

  const bySearch = useMemo(
    () => releases.filter((r) => matchesQuery(r.tag, query)),
    [releases, query],
  );

  const channelCounts = useMemo(() => {
    const counts: Record<ChannelFilter, number> = {
      all: bySearch.length,
      stable: 0,
      prerelease: 0,
    };
    for (const r of bySearch) {
      counts[r.channel === "stable" ? "stable" : "prerelease"]++;
    }
    return counts;
  }, [bySearch]);

  const filtered = useMemo(
    () => bySearch.filter((r) => inChannel(r, channel)),
    [bySearch, channel],
  );

  const lineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of filtered) counts[r.line] = (counts[r.line] ?? 0) + 1;
    return counts;
  }, [filtered]);

  const shown = Math.max(PAGE_SIZE, show);
  const groups = useMemo(
    () => groupByLine(filtered.slice(0, shown)),
    [filtered, shown],
  );

  // "/" jumps to search, like GitHub and most docs sites.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <BoardView
        ref={searchRef}
        groups={groups}
        lineCounts={lineCounts}
        channelCounts={channelCounts}
        query={q}
        channel={channel}
        shown={shown}
        matching={filtered.length}
        newestTag={newestTag}
        onQueryChange={(value) =>
          setParams(
            { q: value || null, show: null },
            { limitUrlUpdates: value ? debounce(300) : undefined },
          )
        }
        onChannelChange={(value) =>
          setParams({ channel: value === "all" ? null : value, show: null })
        }
        onShowMore={() => setParams({ show: shown + PAGE_SIZE })}
        onOpenNotes={(tag) => setParams({ notes: tag }, { history: "push" })}
        onReset={() => setParams({ q: null, channel: null, show: null })}
      />
      {sheetMounted && (
        <NotesSheet
          tag={notes}
          release={notes ? releases.find((r) => r.tag === notes) : undefined}
          onClose={() => setParams({ notes: null }, { history: "replace" })}
        />
      )}
    </>
  );
}
