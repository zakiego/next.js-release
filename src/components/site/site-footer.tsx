import { Separator } from "@/components/ui/separator";
import { REPO_URL } from "@/lib/release";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6">
      <Separator className="mb-6" />
      <p className="max-w-prose text-sm text-pretty text-muted-foreground">
        An unofficial index, not affiliated with Vercel. Data comes from the{" "}
        <a
          href="https://github.com/vercel/next.js/releases"
          className="font-medium text-foreground underline underline-offset-4"
        >
          vercel/next.js releases
        </a>{" "}
        on GitHub and refreshes every hour.{" "}
        <a
          href={REPO_URL}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Source on GitHub
        </a>
        .
      </p>
    </footer>
  );
}
