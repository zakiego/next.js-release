---
name: Next.js Releases
description: An unofficial departures board for every Next.js release, stable and canary.
colors:
  paper: "oklch(0.985 0.002 90)"
  panel: "oklch(1 0 0)"
  ink: "oklch(0.2 0.006 90)"
  ink-strong: "oklch(0.22 0.006 90)"
  wash: "oklch(0.955 0.003 90)"
  wash-hover: "oklch(0.945 0.004 90)"
  graphite: "oklch(0.47 0.008 90)"
  rule: "oklch(0.905 0.004 90)"
  field-stroke: "oklch(0.88 0.004 90)"
  focus-ring: "oklch(0.6 0.01 90)"
  fault: "oklch(0.55 0.21 27)"
  signal: "oklch(0.6 0.17 47)"
  signal-soft: "oklch(0.96 0.04 70)"
  signal-ink: "oklch(0.48 0.15 45)"
typography:
  display:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "clamp(1.25rem, calc(100cqi / var(--chars) / 0.66), 3.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"cv11\", \"ss01\""
  title:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  band:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.025em"
    fontFeature: "\"tnum\", \"zero\""
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "\"cv11\", \"ss01\""
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.025em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  row: "6px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  card: "20px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink-strong}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline-hover:
    backgroundColor: "{colors.wash-hover}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.wash-hover}"
  input-search:
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.md}"
    height: "36px"
  toggle-channel:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "36px"
  toggle-channel-on:
    backgroundColor: "{colors.wash-hover}"
  badge-stable:
    backgroundColor: "{colors.ink-strong}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-canary:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-newest:
    backgroundColor: "{colors.signal-soft}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card-boarding-pass:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# Design System: Next.js Releases

## Overview

**Creative North Star: "The Departures Board"**

Releases read like a gate board at an airport: a ranked, dense list of rows ordered by time, with every version and date set in tabular mono figures. The board sits on warm, near-neutral paper (hue 90, chroma under 0.01) with white panels and hairline rules. Nothing is decorated. Hierarchy comes from scale contrast alone: giant mono version numbers against small uppercase mono field labels.

Two boarding-pass cards lead the page, one for the latest stable and one for the latest canary. Each has the version fitted to the card width, a dashed perforation rule, and labeled segments (channel, published, age). Below them, a sticky search bar and channel toggle sit over a table that is split into sticky minor-version bands with release counts. Notes open in a right-hand sheet so the visitor never leaves the board. Each release also has its own page at `/releases/<tag>` that reuses the same display version, badges, and prose treatment in a narrower column.

There is exactly one hue in the system. Signal orange marks the newest published release and nothing else. Stable and canary are told apart by a filled versus outlined label, never by color. The site is unofficial, so it carries no Vercel or Next.js marks; the wordmark is just "Next.js Releases" set in Geist Mono.

**Key Characteristics:**
- Warm off-white paper with white panels, both light and dark themes
- Geist Mono for every version, date, count, and field label; Geist Sans for prose and controls
- One alert hue (signal), used only on the Newest mark
- Labeled segments and dashed perforation rules borrowed from boarding passes
- Dense rows (6px vertical cell padding) with sticky minor-version bands
- Flat surfaces, hairline borders, shadcn new-york primitives

## Colors

Near-achromatic warm neutrals at hue 90, plus one saturated orange that only ever means "newest". Values are OKLCH and live in `src/app/globals.css`; the frontmatter records the light theme. Dark theme values are in `.impeccable/design.json`.

### Primary
- **Signal Orange** (signal): the dot inside the Newest mark. Also the source of the OG hex copies.
- **Signal Wash** (signal-soft): the Newest badge fill.
- **Signal Ink** (signal-ink): the Newest badge text. Darker than signal so the label stays legible on the wash.

### Neutral
- **Warm Paper** (paper): page background, sticky search bar, sticky band background, outline button fill, text on dark fills.
- **Panel White** (panel): boarding-pass cards, popovers.
- **Board Ink** (ink): all primary text.
- **Ink Strong** (ink-strong): primary buttons and the filled Stable badge.
- **Wash** (wash): muted fills. Card footer strip at 40%, inline code, skeletons, Kbd.
- **Wash Hover** (wash-hover): hover fill for ghost and outline buttons, the selected channel toggle.
- **Graphite** (graphite): secondary text. Dates and ages in rows, field labels, counts, descriptions.
- **Hairline** (rule): every border and divider. Rows, bands, cards, the perforation rule.
- **Field Stroke** (field-stroke): input and toggle borders, one step darker than the hairline.
- **Focus Grey** (focus-ring): the 3px focus ring and outline.
- **Fault Red** (fault): destructive alerts only (failed notes fetch).

### Named Rules
**The One Signal Rule.** The signal hue appears in exactly one component: the Newest mark on the single most recently published release. It never marks a channel, a link, a hover, a button, or a heading. If a second thing needs attention, it gets weight or scale, not signal.

**The Label Not Color Rule.** Stable is a filled ink badge, canary (and other pre-releases) an outlined badge. Both carry the channel name in text. Never encode channel by hue.

## Typography

**Display Font:** Geist Mono (with ui-monospace, monospace)
**Body Font:** Geist (with ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** Geist Mono

**Character:** A gate-board pairing. Geist Mono carries every machine value (versions, dates, counts, labels) so columns line up like a flap display. Geist Sans, with the `cv11` and `ss01` alternates on, handles sentences and control labels.

### Hierarchy
- **Display** (600, fitted from 1.25rem to 3.5rem, line-height 1, -0.03em): the version on a boarding-pass card. The size is computed from the card's container width and the tag's character count, so it fills the card on one line. The release page h1 uses the same face at `clamp(2rem, 7vw, 3.25rem)` with line-height 1.05.
- **Headline** (600, 1.5rem mobile to 1.875rem, -0.02em, balanced): the single page h1 on the home page. Sans, not mono.
- **Title** (600, 1.125rem, -0.025em, mono): the version at the top of the notes sheet.
- **Band** (600, 0.875rem, mono): the minor-version line name in a sticky band, e.g. `v16.5`.
- **Data** (500, 0.875rem, mono, tabular-nums slashed-zero): version links in rows, card field values. Row dates and ages drop to 13px at 400 in graphite.
- **Body** (400, 0.875rem to 1rem, sans): intro copy, footer, empty states, release notes via the typography plugin (prose-sm in the sheet, 70ch max on the release page).
- **Label** (400, 11px, 0.025em, uppercase, mono, graphite): boarding-pass field labels, table column headers, band release counts.

### Named Rules
**The Mono For Machines Rule.** Anything a machine produced (a tag, a date, a count, a relative age) is Geist Mono with `tabular-nums slashed-zero`. Anything a person reads as a sentence is Geist Sans.

**The Scale Contrast Rule.** Hierarchy comes from size jumps between display versions and 11px labels, not from color or extra weights. Only 400, 500, and 600 are used.

**The Labeled Segment Rule.** The 11px uppercase mono label only ever names a data value directly beneath or beside it (a `<dt>`, a column header, a count). It is never a floating eyebrow above a heading.

## Layout

A single centered column. The home page is `max-width: 64rem` (max-w-5xl); the release page narrows to `48rem` (max-w-3xl), with notes capped at 70ch. Side padding is 16px on mobile and 24px from 640px up. Vertical gaps between page blocks are 20px on mobile and 32px from 640px.

The two boarding-pass cards sit side by side from 768px and stack below it. Under them the search bar and channel toggle form one sticky strip (`top: 0`, paper background, 12px vertical padding) that bleeds to the column edges. On mobile the strip stacks search over a full-width toggle. Minor-version bands stick directly under that strip using `--board-band-top` (6.5rem on mobile, 3.75rem from 640px), and `scroll-padding-top` keeps keyboard focus clear of both.

Rows are dense: 6px vertical cell padding, version left, then channel (hidden under 640px, where the badge moves inline next to the version), published date, age (hidden under 768px), and a Notes button whose text label collapses to an icon under 768px. The board pages in batches with a centered "Showing X of Y" count and a "Show N more" outline button.

Breakpoints are Tailwind defaults: 640px (sm), 768px (md). Safe-area insets pad the header top, the footer bottom, and the sheet footer.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (paper, panel white, wash) and 1px hairline borders, not from shadows. The shadows that exist are the stock shadcn ones and stay faint: cards carry `shadow-sm`, outline buttons, inputs, and the toggle group carry `shadow-xs`. Only overlays lift: the notes sheet and dropdown menus use `shadow-lg`, and the sheet sits over a 50% black scrim.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): boarding-pass cards.
- **Control** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): outline buttons, search input, channel toggle.
- **Overlay** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): notes sheet, dropdown menu.

### Named Rules
**The Hairline Rule.** Separation is a 1px hairline border or a tonal step. Sticky surfaces (search strip, bands) get a solid paper background so rows slide under them cleanly, never a blur or a shadow.

## Shapes

Gently rounded from a 10px base (`--radius: 0.625rem`). Controls (buttons, inputs, toggles) use 8px, inline code and Kbd use 6px, boarding-pass cards and empty states use 14px. Badges are full pills, and the Newest mark carries a 6px round dot. The one signature line is the dashed perforation rule (`border-top: 1px dashed`) that splits a boarding-pass card between the version and its labeled segments; the OG images repeat it at 2px.

## Components

### Buttons
Quiet and compact. They label actions in plain sentence case and sit beside data, never over it.
- **Shape:** gently rounded (8px).
- **Primary:** ink-strong fill, paper text, 36px tall, 16px horizontal padding. Used for "Open release page" in the sheet and "Browse all releases" on 404.
- **Outline:** paper fill, hairline border, control shadow, wash-hover on hover. Used for "Show more", "View on GitHub", older/newer navigation, and retry.
- **Ghost:** no fill, wash-hover on hover. Used for row Notes buttons, "Read the notes" on cards, "All releases" back link, header icon buttons.
- **Hover / Focus:** 150ms color transitions on `--ease-out`. Press scales to 0.97 when motion is allowed. Focus is a 3px focus-grey ring.
- **Icons:** Lucide at 16px, placed inline-start or inline-end.

### Chips (Badges)
- **Stable:** filled ink-strong pill with paper text, mono, 12px.
- **Canary / pre-release:** outlined pill with hairline border and ink text, mono, 12px.
- **Newest:** signal-wash pill with signal-ink text and a 6px signal dot. Only on the newest release (see The One Signal Rule).

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** panel white over paper.
- **Shadow Strategy:** Panel shadow (see Elevation & Depth).
- **Border:** 1px hairline.
- **Internal Padding:** 20px. The footer strip is wash at 40% with a hairline top border and 8px vertical padding.

### Inputs / Fields
- **Style:** the search field is an input group: 36px tall, 8px radius, field-stroke border, transparent fill (14% white in dark), control shadow. Text and placeholder are mono. A search icon sits inline-start; a `/` Kbd hint sits inline-end and swaps for a clear button once there's a query.
- **Focus:** 3px focus-grey ring and border shift to focus-grey.
- **Error / Disabled:** fault border and ring at 20% opacity; 50% opacity when disabled.

### Navigation
- **Header:** 56px tall, the mono wordmark on the left, GitHub and theme icon buttons on the right. No nav links.
- **Channel toggle:** a joined outline toggle group (All, Stable, Pre-release) with a mono count after each label. The selected item fills with wash-hover. Counts hide on mobile.
- **Release page:** a ghost "All releases" back link above, and a two-column grid of outline Older/Newer buttons below, each with a small sans caption over a mono tag.

### Boarding-Pass Card
The latest-stable and latest-canary cards. A fitted display version that links to the release page, a dashed perforation rule, then a row of labeled segments: the channel label with its badge (and the Newest mark if it applies), the published date, and the age (hidden on mobile). A wash footer strip holds a ghost "Read the notes" button that opens the sheet.

### Departures Board
The release table. Column headers are 11px uppercase mono labels. Each minor line starts with a sticky band: the line name at band size, then the count as a label, over a hairline. Rows are hairline-separated with a wash-at-50% hover. The version is a mono link that underlines on hover with a 4px offset.

### Notes Sheet
A right-hand sheet, full width on mobile and up to 36rem on desktop. Its header shows the mono title with the channel badge and published date over a hairline. The body scrolls and holds the release notes, which fade in over 200ms once loaded and show a skeleton until then. A sticky footer holds the primary and outline actions side by side. It slides in over 300ms and out over 200ms on `--ease-drawer`. Under reduced motion it only fades.

### Release Notes Prose
The typography plugin, remapped to theme tokens. Headings balance and tighten to -0.015em. Links use a 35%-opacity underline with a 3px offset. Inline code gets a 6px-radius wash pill with no backticks. Long tokens wrap anywhere, and code blocks scroll sideways.

## Do's and Don'ts

### Do:
- **Do** set every version, date, count, and relative age in Geist Mono with `tabular-nums slashed-zero`.
- **Do** keep the signal hue on the Newest mark only, and keep that mark on one release at a time.
- **Do** tell channels apart with the filled Stable badge versus the outlined canary badge, always with the channel name in text.
- **Do** label data segments with 11px uppercase mono labels in graphite, placed directly on the value they name.
- **Do** separate surfaces with 1px hairlines and tonal steps, and give sticky strips a solid paper background.
- **Do** use the motion tokens: `--ease-out` for control feedback (150ms) and content fades (200ms), `--ease-drawer` for the sheet (300ms in, 200ms out), with a reduced-motion fallback.
- **Do** keep the OG hex copies in `src/lib/og/shared.tsx` in sync when a light-theme token changes.

### Don't:
- **Don't** use signal (or any new hue) for links, hover states, buttons, headings, or channel coding.
- **Don't** use Vercel or Next.js logos or marks as the site's identity. The wordmark is the text "Next.js Releases" in Geist Mono.
- **Don't** turn the uppercase mono label into an eyebrow or kicker above a heading. It only names a data value.
- **Don't** add heavier shadows, glass, or blur to resting surfaces. Lift is reserved for overlays.
- **Don't** add weights beyond 400, 500, and 600, or a third typeface.
