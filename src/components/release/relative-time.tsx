"use client";

import { useSyncExternalStore } from "react";
import { formatDate, formatRelative } from "@/lib/release";

// The page is prerendered at deploy time, so "3 days ago" would go stale.
// One shared clock ticks every minute and every label reads from it. The
// static HTML shows ages as of the build, then hydration swaps in the
// visitor's clock, so the column is never blank.
const TICK_MS = 60_000;
const BUILD_TIME = Number(process.env.BUILD_TIME) || 0;
const listeners = new Set<() => void>();
let now = 0;
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (now === 0) now = Date.now();
  return now;
}

function getServerSnapshot() {
  return BUILD_TIME;
}

export function RelativeTime({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <time dateTime={iso} title={formatDate(iso)} className={className}>
      {current ? formatRelative(iso, current) : " "}
    </time>
  );
}
