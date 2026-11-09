import { SearchXIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-16 sm:px-6">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>That release isn&apos;t in the index</EmptyTitle>
          <EmptyDescription>
            The tag may be misspelled, or it was published in the last hour and
            the index hasn&apos;t refreshed yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/">Browse all releases</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
