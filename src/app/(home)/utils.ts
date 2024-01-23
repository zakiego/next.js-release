import { ReleaseSchema } from "@/lib/schema";

export function groupByVersion(
  data: ReleaseSchema,
): { version: string; releases: ReleaseSchema }[] {
  const grouped: { version: string; releases: ReleaseSchema }[] = [];

  for (const release of data) {
    const versionMatch = release.name.match(/v(\d+\.\d+)/);
    if (versionMatch) {
      const version = `v${versionMatch[1]}`;
      const existingGroup = grouped.find((group) => group.version === version);
      if (existingGroup) {
        existingGroup.releases.push(release);
      } else {
        grouped.push({ version, releases: [release] });
      }
    }
  }

  return grouped;
}

export type GroupByVersion = ReturnType<typeof groupByVersion>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
