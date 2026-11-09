// Splits public/data.json into what the server reads at runtime:
//
//   generated/releases/index.json      every published release, without notes
//   generated/releases/notes/<id>.md   one file per release body
//
// A cold function then parses a ~0.5 MB index and reads one small notes file,
// instead of parsing all 5 MB of data.json to render a single release.
// Runs before `dev` and `build` (see package.json). The output is gitignored.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const SOURCE = path.join(process.cwd(), "public", "data.json");
const OUT_DIR = path.join(process.cwd(), "generated", "releases");
const NOTES_DIR = path.join(OUT_DIR, "notes");

const storedRelease = z.object({
  id: z.number(),
  tag_name: z.string(),
  name: z.string().nullish(),
  html_url: z.string().url(),
  prerelease: z.boolean(),
  draft: z.boolean(),
  published_at: z.string().nullish(),
  body: z.string().nullish(),
});

const releases = z
  .array(storedRelease)
  .parse(JSON.parse(readFileSync(SOURCE, "utf8")))
  .filter((r) => !r.draft && r.published_at);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(NOTES_DIR, { recursive: true });

const index = releases.map((r) => {
  writeFileSync(path.join(NOTES_DIR, `${r.id}.md`), r.body ?? "");
  return {
    id: r.id,
    tag: r.tag_name,
    name: r.name ?? "",
    url: r.html_url,
    prerelease: r.prerelease,
    publishedAt: r.published_at,
  };
});

writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(index));
console.log(`Split ${index.length} releases into ${path.relative(process.cwd(), OUT_DIR)}`);
