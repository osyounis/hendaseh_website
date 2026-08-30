# N2 v3 — /nahtadi mockup notes

**Supersedes `v2-NOTES.md`** (which supersedes `v1-NOTES.md`). Both kept for
history; everything still standing is restated here, so this file is
self-contained.

**Files:** `v3.html` (dark, canonical) · `v3-light.html` (light companion), each
with a **390px phone pane**. The pair is still one file — `diff` returns three
lines. The phone pane is still cloned through container queries.

---

## The v3 change: contained cards, not full-bleed bands

**The defect.** v2 built its regions as **square full-bleed bands** — every
section computed `border-radius: 0` and ran the width of the viewport. Every other
page on this site speaks in rounded contained surfaces: `rounded-[22px]` on Home's
flagship band and CTA card, `.home-tile` on every grid on every page. /nahtadi was
the only page using full-bleed regions, which is exactly what read as *"it doesn't
have the same banners/bubbles — it feels different from Home, About, Projects and
Contact."*

In dark it also made the page **flat**, and that was the same defect wearing a
second face: three near-black grounds (`#04101e`, `#050e1a`, `#0b1c30`) striped
across the full viewport give the eye no edge to catch, so the page read as one
black expanse rather than a sequence of objects. `.nh-privacy` looked worst
because it *is* transparent — the green sat on an inner element, so the region
read as a black strip containing something green rather than as a green card.

**The v2 measurement was right and is unchanged — it just never argued for
full-bleed.** `page|raised` is 1.034 in light and `page|sunken` 1.013 in dark, so
a ground delta alone cannot carry a boundary in both themes and ground must travel
with an edge. **That is `.home-tile`'s own recipe: 1.034 plus a hairline.** Home's
flagship band already proves a rounded card inside `.page-wrap` reads as its own
region.

So: **same five regions, same order, same grounds, same hairlines. Only the
container changed.**

| # | Section | Container | Ground |
|---|---|---|---|
| 1 | Hero | rounded card | `--flagship-bg` |
| 2 | App Preview | rounded card | `--surface-sunken` |
| 3 | Reviews | rounded card | `--surface-raised` |
| 4 | Why Nahtadi? | page column | page |
| 5 | Everything You Need | page column | page |
| 6 | FAQ | rounded card | `--surface-raised` |
| 7 | Privacy | rounded card | `--flagship-bg` |

4 and 5 are deliberately uncontained and share the page ground: they are one
argument, proximity is how that gets said, and it is the same shape Home's WORK
section already has (eyebrow + heading + tiles directly on the page).

**Every value is Home's; none is minted.** Radius **22px** and padding **42px**
from `HomeFlagship`/`HomeCTA` (mobile `p-8` → 32px). Section rhythm **80px** from
`page-wrap py-20`. The hero's own 28px radius in v2 **was** a minted value and is
gone; so is the Why card's 24px, which sat one step off the region cards at the
same visual scale for no reason. The hero icon tile is 24px — `HomeFlagship`'s own
tile radius at its small size.

Region boundaries are 160px (80 + 80); within-region (4→5) is 80px. Half, so the
grouping still reads.

### The permitted full-bleed exception: NOT taken

The gallery was allowed to bleed to the viewport, with the projects contract's
mobile chip row as precedent. It is contained instead, and the rail runs to the
**card's** inner edge (negative margin, matching rail padding, `overflow: hidden`
on the card) so a screenshot is cut off exactly at the rounded edge.

Two reasons. The card edge gives an **identical** affordance to a viewport edge —
verified in both themes and at 390px, the peeking screenshot is clipped by the
radius. And taking the exception would have left the one section Omar named as
feeling unlike the rest of the site as the one section that stayed unlike it. The
precedent also differs in kind: the chip row bleeds because on a phone the page
column *is* the viewport, so there is no card edge to cut against.

### The white-on-white latent bug — real, and fixed

`.nh-band-flagship` sets `color: #ffffff`; `.nh-priv-tile` set
`background: #ffffff` and no colour of its own. Every child happened to override
it, so nothing was visible — but any text added directly to that element would
have been white on white at 1:1. The tile now sets `color: var(--flagship-pill-fg)`,
so the card's ink is correct by inheritance rather than by coincidence. Verified:
the tile computes `rgb(7, 60, 51)`.

---

## Token audit — four new tokens became one

The standing rule is that a value missing from the scale becomes a token first,
never an inline magic value. v2 introduced four. **Three were unnecessary.** Each
was rendered side by side against the existing token it could reuse, and in every
case the existing one was as good or better:

| v2 token | Verdict |
|---|---|
| `--flagship-card-body` | **Deleted → `--flagship-pill-fg`.** Rendered side by side, `nahtadi-600` body read as a second, hue-shifted *green* rather than as body text. One ink with hierarchy from size and weight (18/700 against 14/400) is how a card is set. Contrast improves **7.57 → 12.33**. *This is the answer to the question you asked: yes, it can just reuse `--flagship-pill-fg`, and it should.* |
| `--flagship-card-shadow` | **Deleted → `--nahtadi-tile-shadow`**, the shadow this site already uses for a white tile on this exact green band. Side by side it is the better shadow — softer and deeper, where the new one read tight and hard. |
| `--flagship-card-shadow-hover` | **Deleted.** Under a `0 26px 60px rgb(0 0 0/.5)` shadow a deeper one is imperceptible; the −6px lift already carries the hover. |
| `--icon-chip` | **Kept.** The only genuinely new value on the page. |

**Two things for N3 to land in `globals.css` and `/dev/tokens` before building:**

1. **`--icon-chip`** — `rgb(0 113 227 / .10)` light, `rgb(87 180 255 / .12)` dark.
   Ground for the feature-card icon. Justification: eight large bare-accent glyphs
   were the loudest thing on the page; a tinted chip quiets them and gives the
   grid a consistent anchor. It must be a token, not an inline `color-mix`.
2. **`--fg-quiet`** — `ink-600` light / `navy-450` dark. **This is a PROMOTION, not
   a new token.** It is the site's *third* use of that exact pair (`--about-when`,
   `--contact-quiet`). Promote it to a shared semantic step and repoint the other
   two; do not add a fourth alias. It exists because `.nh-rv-who` on `--fg-faint`
   measured **2.14:1** in light — the value `globals.css` itself warns is "a
   separator-glyph colour [that] fails as text".

---

## Everything else, carried forward and re-verified on v3

- **Order:** hero → shots → reviews → why + features → faq → privacy. The App Store
  puts screenshots immediately after the title; for an app they *are* the proof.
- **Green bookends.** Hero and privacy are the same object as `.home-flagship` —
  now literally, both wearing the shared `.nh-band nh-band-flagship`. Drawing the
  hero as a card also removes the nav-over-hero seam deferred to B6.
- **C1 — carousel height.** One grid cell; container permanently as tall as the
  longest review. Re-verified at 1440: one distinct height across all six,
  **270.328125px**, unchanged from v2. `min-h-[300px]` deleted. Inactive slides
  `visibility: hidden`, so genuinely inert.
- **C2 — the pause control.** Real `aria-pressed` button (no checkbox can stop a
  `setInterval`); icon and accessible name flip together; self-drawn filled
  transport glyphs, not link-affordance family members; hover-pause deleted, focus
  -pause kept as separate state; hidden entirely under reduced motion.
- **FAQ row hairlines on `--edge`**, not `--edge-soft` — verified `rgb(43,66,91)`
  dark / `rgb(210,210,215)` light. `--edge-soft` is 1.023 on the dark raised
  ground, invisible, on a section that is nothing but hairlines.
- **The quiet star**, recorded as considered and rejected.
- **`$3.99`** on the One-Time Purchase card as data under its own label.
- **Instagram** removed with the newsletter.

## Audit — re-run on v3, both themes

- **Contrast: 29 pairs per theme, zero failures.** Tightest: `--accent` review
  title on `--surface-raised` **4.70** light; footer and features sub **4.91**;
  shots captions on the sunken card **5.44** (via `--fg-muted-on-tint` — that card
  still carries no accent text and no eyebrow, because `--accent` is 3.85 and
  `--fg-muted` 4.15 on `#e8e8ed`). Privacy card ink on white **12.33 / 12.33**
  after the token collapse. Green-band figures against the gradient's 0% stop.
- **Zero bands at `border-radius: 0`.** All seven regions 22px, 1056px wide in the
  page column at 1440.
- **Targets:** prev/next/pause 44×44 · rail buttons 44×44 · badge 237×45 · privacy
  cards 401×219 · **carousel dots 26×44**. The dots clear WCAG 2.5.8's 24×24
  minimum with non-overlapping spacing but are *not* 44 wide — widening them to 44
  would overflow the control row at 390px. Stating that precisely because v2's
  notes rounded it to "all ≥44", which was overstated on the width axis.
- **Reduced motion, rendered:** entrance `animation-name: none`, `opacity: 1`;
  privacy-tile `transition-duration: 0s`; pause control `display: none`; reveals
  never armed.
- **Phone (390px):** cards 350px at 22px radius, `32px 22px` padding, rail flush to
  the card edge, **no horizontal overflow**.

## Rulings landed this round

- **`PRIVACY` is now row A23 in `COPY-LOCKED.md`, added by Amendment 3.** It is the
  only row in that document that adds a string rather than replacing one. N3 builds
  from the row, not from this mockup.
- **A1 does not revert.** It feeds the FAQPage JSON-LD, which Google surfaces
  detached from the page where the One-Time Purchase card does not exist.

## Build notes for N3

- Land `--icon-chip` and the `--fg-quiet` promotion in `globals.css` +
  `/dev/tokens` **before** building the page.
- Extract the pause/play glyphs to a shared module beside `HomeTicker.tsx`, not
  into `LinkAffordance.tsx`.
- Carousel dots need `type="button"`.
- `/nahtadi` is not one of the four nav pages, so no nav item is active.
- Screenshot staleness (`screenshot-4.png` bakes in `v1.1.0`; shipped is 1.2.1) is
  a separate workstream needing a re-capture. Not a blocker.
- Spacing offered as candidate steps for the scale sub-project 4 still owes: region
  rhythm **80px** (Home's `py-20`), within-region **40px**, card padding **42px**
  desktop / **32px 22px** phone. All are Home's existing values; do not promote to
  a named scale until there is a second consumer.
