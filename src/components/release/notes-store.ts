"use client";

import { useCallback, useEffect, useReducer } from "react";

// Kept apart from the sheet so the board can prefetch without pulling the
// sheet (and Radix Dialog) into the first page load.
export const loadReleaseNotes = () =>
  import("@/components/release/release-notes");
const loadSheet = () => import("@/components/release/notes-sheet");

type NotesPayload = { tag: string; title: string; url: string; body: string };

type Result =
  | { status: "ready"; data: NotesPayload }
  | { status: "error"; message: string; retryable: boolean };

// Results live outside React, so a prefetched or reopened release shows at
// once. Components subscribe and re-render whenever a fetch settles.
const results = new Map<string, Result>();
const inflight = new Set<string>();
const listeners = new Set<() => void>();

class NotFoundError extends Error {}

function load(tag: string) {
  if (results.has(tag) || inflight.has(tag)) return;
  inflight.add(tag);
  fetch(`/api/releases/${encodeURIComponent(tag)}`)
    .then(async (res) => {
      if (res.status === 404) throw new NotFoundError();
      if (!res.ok) throw new Error(`The server answered ${res.status}.`);
      return (await res.json()) as NotesPayload;
    })
    .then((data) => {
      results.set(tag, { status: "ready", data });
    })
    .catch((error: unknown) => {
      const notFound = error instanceof NotFoundError;
      results.set(tag, {
        status: "error",
        retryable: !notFound,
        message: notFound
          ? "This tag isn't in the index. Check the spelling, or come back in an hour if it was just published."
          : error instanceof Error && error.message !== "Failed to fetch"
            ? error.message
            : "Check your connection.",
      });
    })
    .finally(() => {
      inflight.delete(tag);
      listeners.forEach((listener) => listener());
    });
}

/**
 * Starts loading a release's notes and the markdown renderer before the sheet
 * opens. Call it on hover, focus or pointer-down of anything that opens notes.
 */
export function prefetchNotes(tag: string) {
  load(tag);
  void loadReleaseNotes();
  void loadSheet();
}

export function useReleaseNotes(tag: string | null) {
  const [, rerender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, []);

  useEffect(() => {
    if (tag) load(tag);
  }, [tag]);

  const retry = useCallback(() => {
    if (!tag) return;
    results.delete(tag);
    load(tag);
    rerender();
  }, [tag]);

  const state = tag ? results.get(tag) : undefined;
  return { state, retry };
}
