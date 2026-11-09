# AGENTS.md

## Project overview

Next.js Releases is an unofficial, searchable index of every Next.js release from `vercel/next.js`, styled as an airport departures board. Production: https://next-js-release.vercel.app (Vercel, deploys on every push to `main`).

- Next.js 16 App Router, React 19, TypeScript (strict)
- Tailwind CSS v4 (`src/app/globals.css`, no `tailwind.config`), `@tailwindcss/typography` for release notes
- shadcn/ui, new-york style, Radix primitives via the `radix-ui` package, Lucide icons
- `nuqs` for URL state (search query, channel filter), `next-themes` for light and dark
- `react-markdown` with `remark-gfm` and `remark-github` to render release notes
- Bun is the package manager and script runner

Read `PRODUCT.md` (who it's for, constraints) and `DESIGN.md` (tokens, typography, component rules) before any UI change. They are the source of truth for design decisions.

## Setup and commands

```bash
bun install
bun run dev          # next dev
bun run build        # next build
bun run typecheck    # tsc --noEmit
bun run lint         # eslint .
bun run update-data  # fetch new releases into public/data.json, needs OCTOKIT_TOKEN
```

There is no test suite. `bun run typecheck` and `bun run lint` must both pass before any commit. Run `bun run build` when you touch routing, caching, `generateStaticParams`, metadata, or OG images.

## Architecture

### Data flow

```
GitHub API (vercel/next.js releases)
  -> src/lib/data.ts            (Bun script, run hourly by .github/workflows/update.yml)
  -> public/data.json           (~5 MB, ~4,000 releases, committed by the bot)
  -> scripts/split-data.mjs     (runs before dev and build, validates with zod)
  -> generated/releases/        (index.json without notes + notes/<id>.md, gitignored)
  -> src/lib/releases.server.ts (reads the small index once, sorts, memoizes; reads one notes file per release)
  -> pages, API route, OG images
```

- A data refresh is a new commit, so a new deploy is the only time data changes. Routes cache until the next deploy. Don't add ISR or revalidation timers.
- `public/data.json` keeps only the fields the site uses (`id`, `tag_name`, `name`, `html_url`, `prerelease`, `draft`, `published_at`, `body`). It's not a public API. Change `slim()` in `src/lib/data.ts`, the zod schema in `scripts/split-data.mjs` and the `IndexedRelease` type in `releases.server.ts` together.
- `generated/releases/` only exists after `bun run dev` or `bun run build` (their `pre` scripts run the split). If a server read fails with ENOENT, run `node scripts/split-data.mjs`.
- Never hand-edit `public/data.json`. Regenerate it with `bun run update-data`.
- Routes that read release data at runtime need `generated/releases` listed in `outputFileTracingIncludes` in `next.config.ts`. Add new on-demand routes there too.

### Routes

- `src/app/(home)/` is the board. `page.tsx` is a server component that passes slim `ReleaseSummary` objects (tag, channel, line, date, no bodies) to the client board. `board-view.tsx`, `release-board.tsx`, `latest-card.tsx` hold the cards, search, filter and table.
- `src/app/releases/[tag]/page.tsx` is the per-release page. The newest 30 are prebuilt, the rest render on first visit and stay cached.
- `src/app/api/releases/[tag]/route.ts` returns one release's body as JSON. The notes sheet fetches from it so the home page never ships release bodies.
- `opengraph-image.tsx` (site and per release), `robots.ts`, `sitemap.ts`, `not-found.tsx`.

### Libraries

- `src/lib/release.ts`: shared helpers, safe on client and server (version parsing and sorting, channels, minor-line grouping, `PAGE_SIZE`, `SITE_URL`, `SITE_NAME`).
- `src/lib/releases.server.ts`: `server-only`. Never import it from a client component.
- `src/lib/og/shared.tsx`: OG image layout and hex copies of the light-theme tokens. Keep those in sync when a token in `globals.css` changes.

### Components

- `src/components/ui/`: shadcn primitives. Add new ones with `bunx shadcn@latest add <name>`, don't hand-write them.
- `src/components/release/`: channel badge, notes sheet, relative time, release notes renderer.
- `src/components/site/`: header, footer, theme toggle, GitHub icon.

## Code style

- TypeScript strict, ESM. Import with the `@/` alias (`@/*` maps to `./src/*`).
- Server components by default. Add `"use client"` only where state or browser APIs are needed, and pass the smallest props possible across the boundary (never full release bodies or the whole raw dataset).
- Build UI from shadcn components and their variants before adding custom markup or one-off classes.
- Follow `DESIGN.md`: Geist Mono with `tabular-nums slashed-zero` for every version, date and count. Geist Sans for prose. One accent hue (signal orange), only on the Newest mark. Channels are told apart by filled versus outlined badge, never by color.
- Motion uses the `--ease-out` and `--ease-drawer` tokens and must respect `prefers-reduced-motion`.
- The site is unofficial. Never use Vercel or Next.js logos as its identity.
- Everything code-related (names, comments, commits) is in English.

## Commits and pull requests

- Conventional Commits, imperative and lowercase: `fix(board): keep band below sticky search`.
- One logical change per commit. `typecheck` and `lint` pass at every commit.
- The bot's own commits are titled `Update release data`. Don't rewrite or squash them.

## Gotchas

- `bun run update-data` without `OCTOKIT_TOKEN` hits the unauthenticated GitHub rate limit fast.
- `data.json` is about 5 MB. Never import it into app code. Servers read `generated/releases`, and the home page sends the board a packed string (`packSummaries` in `src/lib/release.ts`).
- Release tags can contain characters that need URL encoding. Routes call `decodeURIComponent` on `params.tag`, and links go through `releaseHref()`.
