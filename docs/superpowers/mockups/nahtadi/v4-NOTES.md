# N2 v4 — /nahtadi mockup notes

**Supersedes `v3-NOTES.md`.** v1–v3 kept as history.

**Files:** `v4.html` (dark, canonical) · `v4-light.html` (light companion), each
with a 390px phone pane. The pair is still one file — `diff` returns three lines.

---

## 1. The air between region cards — halved

**The argument, not the number.** Boxes make space legible. On Home the space
between sections is unbounded, so the eye reads rhythm rather than a gap and 80px
a side (`py-20`) is right. Here two rounded card edges turn the same air into a
**measurable distance**, and the edge now does the separating that the space used
to do alone. So the space gives some back.

| | v3 | v4 |
|---|---|---|
| Between region cards | 160px (80 + 80) | **80px** (40 + 40) |
| Within region (why → features) | 80px | **48px** (24 + 24) |
| Phone, between regions | 112px | **64px** (32 + 32) |
| Phone, within region | 56px | **40px** (20 + 20) |

Within-region is deliberately **not** halved to 20px a side. Why and Features are
*uncontained* sections on the page ground with no edges at all, so air is their
only separator and has to carry more of the work than it does between two cards.
The ratio moves 1:2 → 1:1.67 for exactly that reason.

All values are existing ones (40 and 56 appear in `about.css`; 32 is Home's
mobile `p-8`; 20 is `page-wrap`'s phone inset). Picked by drawing, not arithmetic.

## 2. The privacy/support tiles now read as links

**Not a link colour** — the site's answer is the glyph, and on this ground there
is no good link colour anyway (`--accent` is `#0071e3`; blue on dark green
clashes).

**The signal is strengthened by borrowing the vocabulary the site already uses for
"actionable on the green band": Home's flagship pill, inverted for a white
ground.** Literally the same two tokens, swapped — a white pill with green ink on
the band becomes a **green pill with white ink** on a white card. That is the same
contrast rule `home/APPROVED.md` already generalized for the arch icon's tile
("must CONTRAST its ground"), applied to an action instead of an icon. **Nothing
is minted.**

Drawn against the alternative (a strengthened plain text line at Contact's
15px/700 with a hover nudge) side by side, the pill is the only one that reads as
actionable rather than as bold body text. Screenshot method again; it was not
close.

### The card stays the link, and that is deliberate

The Projects contract's *"whole card is NOT the link; actions are explicit pills"*
governs cards with **two** actions (case study + GitHub), where one link cannot
express both. These tiles have exactly **one** action each — which is Contact's
case, where the card **is** the link. Keeping it that way preserves a **401×242**
touch target instead of shrinking it to the pill, and these two links are how the
App Store requires privacy and support to be reachable.

So the pill is **presentational**: a `<span>` inside the `<a>`. Verified — the
tile is an `A` and contains **zero** nested `<a>` or `<button>`. The press lives on
the card; the pill darkens to `nahtadi-900` on the card's hover, which is what
makes it read as *the card's* action rather than as a second target.

`display: inline-block`, **not** `inline-flex`: the label is a text run (`Get ` +
the nowrap span the glyph is welded to), and flex makes each text node a flex item
and collapses the space between them. The first attempt rendered `GetSupport` —
caught by drawing it.

## 3. The screenshot rail — root cause, and a second bug underneath it

**Confirmed, with one correction to the diagnosis.** The rail was centring its
first and last item with `padding-inline: calc(50% - 105px)`, a snap-centred
carousel technique. Measured leading padding by viewport, before the fix:

| 390 | 720 | 1024 | 1280 | 1440 |
|---|---|---|---|---|
| 61.5px | **214.5px** | 42px | 42px | 42px |

The calc lives in the **sub-880 rule**, so it bit from 390 all the way up to 880 —
half-laptop widths, exactly where it was seen — and stopped there, because past 880
the base 42px already applied. So it did *not* reach 500px a side at 1280. Same
root cause, same fix; recorded because the register should be right.

**The fix:** leading and trailing padding are the card's own inner inset (a
constant), and `scroll-snap-align` goes `center` → `start`. That is also what the
App Store's own rail does — it begins at the content edge and scrolls right, which
is what a visitor arriving from that listing expects.

### The second bug, which only the cross-width check exposed

`scroll-snap-align: start` snaps to the **snapport**, which is the scroll
container's **padding box** — not its content box. So the browser snapped the first
item to the padding-box edge on load and *scrolled the 42px leading inset away*:
the first screenshot sat at x=186, the card's inner border edge, instead of x=228,
its content edge where the heading starts.

`scroll-padding-inline` insets the snapport to match the visual inset, so the two
agree. **It must track `padding-inline` at every breakpoint** (42px / 22px).

**Verified across eight widths — 390, 500, 720, 880, 1024, 1280, 1440, 1728:**
leading padding takes exactly two values (22 and 42, one per breakpoint) and never
scales with viewport width; the leading inset from the card's content edge is
**0px at every width**; the trailing inset at full-right scroll is **0px at every
width**. A single-width check is what let the original through.

---

## Keep-list — re-verified on v4, both themes

Three-line theme pair · every region a rounded card in the page column at Home's
values (22px, 42px, 24px icon tile) · five regions and their order · ground +
hairline separation · green privacy card bookending the hero · the white tile and
its ink · 8 `.home-tile` · the glyph family · 6 entrance beats · cloned 390px phone
pane · **one carousel height, 270.328125px** · real `aria-pressed` pause button ·
`--edge` on the FAQ hairlines (`rgb(43,66,91)` dark / `rgb(210,210,215)` light) ·
quiet star recorded as rejected · COPY-LOCKED Amendment 3 / row A23 · A1 unchanged.

## Audit — v4, both themes

- **Contrast: 29 pairs per theme, zero failures**, including the new pill (white on
  its own `nahtadi-700` fill, **12.33:1**).
- **Boxes:** prev/next/pause 44×44 · rail buttons 44×44 · badge 237×45 · privacy
  card 401×242 · **pill 175×44** · **dots 26×44**.
  The dots clear WCAG 2.5.8's 24×24 with non-overlapping spacing but are **not**
  44 wide; widening them overflows the control row at 390px. Stated precisely.
- **Zero bands at `border-radius: 0`.**
- **Reduced motion, rendered:** entrance `animation-name: none`, `opacity: 1`; pill
  and tile `transition-duration: 0s`; pause control `display: none`; reveals never
  armed.
- **Phone (390px):** rail leading inset 0, pill 175×44, no horizontal overflow.

## Build notes for N3 (unchanged from v3 unless noted)

- Land **`--icon-chip`** and the **`--fg-quiet` promotion** in `globals.css` +
  `/dev/tokens` before building. `--fg-quiet` is the third use of the
  `ink-600`/`navy-450` pair — promote, do not add a fourth alias.
- **`scroll-padding-inline` must track `padding-inline` on the rail** at every
  breakpoint. This is the kind of pairing that silently drifts; worth an e2e
  assertion that the first screenshot's left edge equals the card's content edge at
  several widths.
- Extract the pause/play glyphs to a shared module beside `HomeTicker.tsx`.
- Carousel dots need `type="button"`.
- The privacy pill is a `<span>` inside the card's `<a>` — **never** a nested
  `<a>`/`<button>`.
- `/nahtadi` is not one of the four nav pages, so no nav item is active.
- Screenshot staleness (`screenshot-4.png` bakes in `v1.1.0`; shipped is 1.2.1) is
  a separate workstream. Not a blocker.
