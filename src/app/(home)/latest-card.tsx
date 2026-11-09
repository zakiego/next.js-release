import { PanelRightOpenIcon } from "lucide-react";
import Link from "next/link";
import { ChannelBadge, NewestMark } from "@/components/release/channel-badge";
import { RelativeTime } from "@/components/release/relative-time";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, releaseHref, type ReleaseSummary } from "@/lib/release";

const FIELD_LABEL =
  "font-mono text-[11px] tracking-wide text-muted-foreground uppercase";

/**
 * A boarding-pass style card: the version at the largest size on the page,
 * fitted to the card width, then labeled segments below a perforated rule.
 */
export function LatestCard({
  label,
  release,
  isNewest,
}: {
  label: string;
  release: ReleaseSummary;
  isNewest: boolean;
}) {
  return (
    <Card
      className="@container h-full gap-0 overflow-hidden py-0"
    >
      {/* Side by side the cards share a height, so the header takes the slack
          and sits the version on its bottom edge. The perforated rules line up
          even when one version is fitted smaller than the other. */}
      <CardHeader className="flex-1 content-end px-5 pt-5 pb-4">
        <CardTitle
          style={{ "--chars": release.tag.length } as React.CSSProperties}
          className="font-mono text-[clamp(1.25rem,calc(100cqi/var(--chars)/0.66),3.5rem)] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap"
        >
          <Link href={releaseHref(release.tag)} translate="no" className="rounded-sm">
            {release.tag}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        <div aria-hidden="true" className="border-t border-dashed" />
        <dl className="flex flex-wrap gap-x-6 gap-y-3 py-4 text-sm sm:gap-x-8">
          <div className="flex flex-col gap-1.5">
            <dt className={FIELD_LABEL}>{label}</dt>
            <dd className="flex items-center gap-1.5">
              <ChannelBadge channel={release.channel} />
              {isNewest && <NewestMark />}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className={FIELD_LABEL}>Published</dt>
            <dd className="tabular font-mono font-medium whitespace-nowrap">
              <time dateTime={release.publishedAt}>
                {formatDate(release.publishedAt)}
              </time>
            </dd>
          </div>
          <div className="flex flex-col gap-1.5 max-sm:hidden">
            <dt className={FIELD_LABEL}>Age</dt>
            <dd className="tabular font-mono font-medium whitespace-nowrap">
              <RelativeTime iso={release.publishedAt} />
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="mt-auto border-t bg-muted/40 px-5 py-2 max-sm:hidden [.border-t]:pt-2">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link
            href={`/?notes=${encodeURIComponent(release.tag)}`}
            scroll={false}
            aria-label={`Read ${release.tag} notes`}
          >
            <PanelRightOpenIcon data-icon="inline-start" />
            Read the notes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
