import { z } from "zod";

import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";

export const releaseSchema = z.array(
  z.object({
    url: z.string(),
    html_url: z.string(),
    name: z.string(),
    prerelease: z.boolean(),
    draft: z.boolean(),
    published_at: z.string(),
    body: z.string().transform(async (body) => {
      const html = await remark()
        .use(remarkGfm)
        .use(remarkGithub, {
          repository: "vercel/next.js",
        })
        .process(body);

      return html.toString();
    }),
  }),
);

export type ReleaseSchema = z.infer<typeof releaseSchema>;
