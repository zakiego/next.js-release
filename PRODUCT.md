# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Next.js developers. They land here to check the latest stable or canary version, read what changed in a specific release, or find when a fix shipped. Visits are short and goal-driven, often from a search result or a shared link.

## Product Purpose

A fast, readable index of every Next.js release from `vercel/next.js` on GitHub. Success means finding a version and reading its notes in seconds, faster than scrolling GitHub's releases page.

## Positioning

Every release since 2016 on one searchable page, grouped by minor line, with stable and canary separated. Each release also gets its own shareable page. GitHub's releases page is one long markdown stream with no grouping or filtering.

## Operating Context

A GitHub Actions workflow runs every hour, pulls releases through the GitHub API, and commits `public/data.json` when something new shipped. Each commit redeploys the site on Vercel (`next-js-release.vercel.app`).

## Capabilities and Constraints

- Data comes only from GitHub releases. Release notes are GitHub-flavored markdown with `#123` and `@user` references.
- `public/data.json` keeps only the fields the site uses (decided 2026-11-09). It is not a promised public API.
- About 4,000 releases. Most are canaries.
- Unofficial project. It must not look like an official Vercel or Next.js property.

## Brand Commitments

None beyond the name "Next.js Releases". No logo exists. Don't use Vercel or Next.js marks as the site's own identity.

## Evidence on Hand

Real release data in `public/data.json`. No users, metrics or testimonials. Don't invent any.

## Product Principles

1. Get to the version fast. Search and filters come before anything decorative.
2. Show release notes in place. Don't force a trip to GitHub.
3. Every release has a stable URL that can be shared.
4. Stay honest about being unofficial.
