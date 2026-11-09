# Next.js Releases

An unofficial, searchable index of every Next.js release: https://next-js-release.vercel.app

## Development

```bash
bun install
bun run dev          # local dev server
bun run build        # production build
bun run typecheck
bun run lint
bun run update-data  # fetch new releases into public/data.json (needs OCTOKIT_TOKEN)
```

A GitHub Actions workflow runs `update-data` every hour and commits `public/data.json` when a new release ships.

Product and design decisions live in `PRODUCT.md` and `DESIGN.md`.
