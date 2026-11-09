---
version: 1
slug: "src-app-home-page-tsx"
primary_target: "src/app/(home)/page.tsx"
related_targets: []
---

# Home: release board

Scope: `/` (release index) and `/releases/[tag]` (one release). Visitor mode: Operate.
Audience: Next.js developers checking latest stable/canary, reading what changed, finding when a fix shipped.
Constraints: unofficial, no Vercel or Next.js marks as identity. Real data only.

## Direction contract

seed: 8ddee99ccda8aa7d

FORM: departures board (assigned 4), fused with challenger vernacular-ephemera-boarding-pass-and-gate-board as the same world, verdict: wins

THESIS: Releases read like a departures board: a ranked, dense board of rows ordered by time, not a markdown stream (GitHub's default) and not a bare admin table (the old site).

OWN-WORLD: High-contrast neutral panels, tabular mono figures for every version and date, labeled segments like a boarding pass. One alert color is reserved for "newest", used nowhere else. Stable and canary are told apart by a channel label, not by color alone.

STORY: In one glance the visitor knows the latest stable and the latest canary and how old each is. Then they search or filter the board and open notes in place.

FIRST VIEWPORT: Two boarding-pass cards (latest stable, latest canary) with the version at display size, then the search and channel toggle, then the first rows of the board.

SIGNATURE: Notes open in a side sheet without leaving the board. Each row has a permanent link to `/releases/<tag>`.

RAISES: From wayfinding, sticky minor-version bands with release counts. From the type specimen, hierarchy by scale contrast alone: giant version numbers against small mono labels.
