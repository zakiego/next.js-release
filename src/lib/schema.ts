import { z } from "zod";

export const releaseSchema = z.array(
  z.object({
    url: z.string(),
    assets_url: z.string(),
    upload_url: z.string(),
    html_url: z.string(),
    id: z.number(),
    author: z.any(),
    node_id: z.string(),
    tag_name: z.string(),
    target_commitish: z.string(),
    name: z.string(),
    draft: z.coerce.boolean(),
    prerelease: z.coerce.boolean(),
    created_at: z.string(),
    published_at: z.string(),
    assets: z.any(),
    tarball_url: z.string(),
    zipball_url: z.string(),
    body: z.string(),
    reactions: z.any(),
    mentions_count: z.number().nullish(),
  }),
);

export type ReleaseSchema = z.infer<typeof releaseSchema>;
