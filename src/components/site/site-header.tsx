import Link from "next/link";
import { GitHubIcon } from "@/components/site/github-icon";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { REPO_URL, SITE_NAME } from "@/lib/release";

export function SiteHeader() {
  return (
    <header className="pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="-mx-2 rounded-md px-2 py-1 font-mono text-sm font-medium tracking-tight"
        >
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <a href={REPO_URL} aria-label="Source code on GitHub">
              <GitHubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
