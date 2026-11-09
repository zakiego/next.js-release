import { Badge } from "@/components/ui/badge";
import { CHANNEL_LABEL, type Channel } from "@/lib/release";

export function ChannelBadge({ channel }: { channel: Channel }) {
  return (
    <Badge
      variant={channel === "stable" ? "default" : "outline"}
      className="font-mono tracking-tight"
    >
      {CHANNEL_LABEL[channel]}
    </Badge>
  );
}

/** The one place the signal color appears: the newest published release. */
export function NewestMark() {
  return (
    <Badge variant="signal" className="font-mono tracking-tight">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
      Newest
    </Badge>
  );
}
