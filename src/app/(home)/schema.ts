import { z } from "zod";

export const releaseSchema = z.array(
  z.object({
    url: z.string(),
    html_url: z.string(),
    name: z.string(),
    prerelease: z.boolean(),
    draft: z.boolean(),
    published_at: z.string(),
    body: z.string(),
  }),
);

export type ReleaseSchema = z.infer<typeof releaseSchema>;
