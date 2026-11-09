"use client";

import { ArrowRightIcon, RotateCwIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChannelBadge } from "@/components/release/channel-badge";
import {
  loadReleaseNotes,
  useReleaseNotes,
} from "@/components/release/notes-store";
import { GitHubIcon } from "@/components/site/github-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, releaseHref, type ReleaseSummary } from "@/lib/release";

// Markdown and its plugins only load once someone opens (or points at) a release.
const ReleaseNotes = dynamic(
  () => loadReleaseNotes().then((m) => m.ReleaseNotes),
  { loading: () => <NotesSkeleton /> },
);

export function NotesSheet({
  release,
  tag,
  onClose,
}: {
  release: ReleaseSummary | undefined;
  tag: string | null;
  onClose: () => void;
}) {
  const { state, retry } = useReleaseNotes(tag);
  const open = tag !== null;

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="gap-2 border-b pr-12">
          <SheetTitle
            translate="no"
            className="font-mono text-lg tracking-tight [overflow-wrap:anywhere]"
          >
            {tag}
          </SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-wrap items-center gap-2">
              {release ? (
                <>
                  <ChannelBadge channel={release.channel} />
                  <span>
                    Published{" "}
                    <time
                      dateTime={release.publishedAt}
                      className="tabular font-mono font-medium text-foreground"
                    >
                      {formatDate(release.publishedAt)}
                    </time>
                  </span>
                </>
              ) : (
                <span>Release notes</span>
              )}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          {state?.status === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn&apos;t load the notes</AlertTitle>
              <AlertDescription>
                <p>{state.message}</p>
                {state.retryable && (
                  <Button variant="outline" size="sm" onClick={retry} className="mt-2">
                    <RotateCwIcon data-icon="inline-start" />
                    Try again
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ) : state?.status === "ready" ? (
            <div className="animate-in fade-in-0 duration-200 ease-out">
              <ReleaseNotes body={state.data.body} className="prose-sm" />
            </div>
          ) : (
            <NotesSkeleton />
          )}
        </div>

        {tag && release && (
          <SheetFooter className="flex-row border-t pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button asChild className="flex-1">
              <Link href={releaseHref(tag)}>
                Open release page
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a
                href={
                  state?.status === "ready"
                    ? state.data.url
                    : `https://github.com/vercel/next.js/releases/tag/${encodeURIComponent(tag)}`
                }
              >
                <GitHubIcon data-icon="inline-start" />
                View on GitHub
              </a>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function NotesSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status">
      <span className="sr-only">Loading release notes…</span>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="mt-4 h-5 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
