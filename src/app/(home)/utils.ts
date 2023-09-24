import { ReleaseSchema } from "@/app/(home)/schema";

export function groupByVersion(
  data: ReleaseSchema,
): { version: string; releases: ReleaseSchema }[] {
  const grouped: { version: string; releases: ReleaseSchema }[] = [];

  data.forEach((release) => {
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
  });

  return grouped;
}

export type GroupByVersion = ReturnType<typeof groupByVersion>;

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
