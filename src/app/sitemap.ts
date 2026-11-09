import type { MetadataRoute } from "next";
import { releaseHref, SITE_URL } from "@/lib/release";
import { getNewest, getReleases } from "@/lib/releases.server";

export default function sitemap(): MetadataRoute.Sitemap {
  const releases = getReleases();
  return [
    { url: SITE_URL, lastModified: getNewest()?.publishedAt },
    ...releases.map((r) => ({
      url: `${SITE_URL}${releaseHref(r.tag)}`,
      lastModified: r.publishedAt,
    })),
  ];
}
