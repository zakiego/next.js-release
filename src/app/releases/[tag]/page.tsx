import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChannelBadge, NewestMark } from "@/components/release/channel-badge";
import { RelativeTime } from "@/components/release/relative-time";
import { ReleaseNotes } from "@/components/release/release-notes";
import { GitHubIcon } from "@/components/site/github-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CHANNEL_LABEL,
  formatDate,
  releaseHref,
  SITE_NAME,
  SITE_URL,
} from "@/lib/release";
import {
  getNeighbours,
  getNewest,
  getRelease,
  getReleases,
} from "@/lib/releases.server";

type Props = { params: Promise<{ tag: string }> };

// Prebuild the newest releases. Older ones render on first visit and stay
// cached until the next deploy.
export function generateStaticParams() {
  return getReleases()
    .slice(0, 30)
    .map((r) => ({ tag: r.tag }));
}

async function resolve(params: Props["params"]) {
  const { tag } = await params;
  return getRelease(decodeURIComponent(tag));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const release = await resolve(params);
  if (!release) return { title: "Release not found", robots: { index: false } };

  const title = `${release.tag} release notes`;
  const description = `Next.js ${release.tag} (${CHANNEL_LABEL[release.channel].toLowerCase()}), published ${formatDate(release.publishedAt)}. Read the full release notes.`;
  const url = releaseHref(release.tag);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, publishedTime: release.publishedAt },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ReleasePage({ params }: Props) {
  const release = await resolve(params);
  if (!release) notFound();

  const { newer, older } = getNeighbours(release.tag);
  const isNewest = getNewest()?.tag === release.tag;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `Next.js ${release.tag} release notes`,
    datePublished: release.publishedAt,
    url: `${SITE_URL}${releaseHref(release.tag)}`,
    isBasedOn: release.url,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-4 pb-12 sm:px-6 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button asChild variant="ghost" size="sm" className="-ml-3 w-fit">
        <Link href="/">
          <ArrowLeftIcon data-icon="inline-start" />
          All releases
        </Link>
      </Button>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <ChannelBadge channel={release.channel} />
          {isNewest && <NewestMark />}
          <span className="tabular font-mono text-sm text-muted-foreground">
            {release.line} line
          </span>
        </div>
        <h1 className="font-mono text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance [overflow-wrap:anywhere]">
          {release.tag}
        </h1>
        {release.title !== release.tag && (
          <p className="text-lg text-muted-foreground">{release.title}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="tabular text-sm text-muted-foreground">
            Published{" "}
            <time dateTime={release.publishedAt} className="font-mono font-medium text-foreground">
              {formatDate(release.publishedAt)}
            </time>{" "}
            · <RelativeTime iso={release.publishedAt} />
          </p>
          <Button asChild variant="outline" size="sm">
            <a href={release.url}>
              <GitHubIcon data-icon="inline-start" />
              View on GitHub
            </a>
          </Button>
        </div>
      </header>

      <Separator />

      <article aria-label={`Release notes for ${release.tag}`}>
        <ReleaseNotes body={release.body} className="max-w-[70ch]" />
      </article>

      <Separator />

      <nav aria-label="Other releases" className="grid grid-cols-2 gap-3">
        {older ? (
          <Button asChild variant="outline" className="h-auto justify-start py-3">
            <Link href={releaseHref(older.tag)}>
              <ChevronLeftIcon data-icon="inline-start" />
              <span className="flex min-w-0 flex-col items-start">
                <span className="text-xs font-normal text-muted-foreground">Older</span>
                <span className="w-full truncate font-mono">{older.tag}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {newer && (
          <Button asChild variant="outline" className="h-auto justify-end py-3">
            <Link href={releaseHref(newer.tag)}>
              <span className="flex min-w-0 flex-col items-end">
                <span className="text-xs font-normal text-muted-foreground">Newer</span>
                <span className="w-full truncate text-right font-mono">{newer.tag}</span>
              </span>
              <ChevronRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        )}
      </nav>
    </main>
  );
}
