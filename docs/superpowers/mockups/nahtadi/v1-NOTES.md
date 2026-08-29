# N2 v1 — /nahtadi mockup notes

**Files:** `v1.html` (dark, canonical) · `v1-light.html` (light companion).
Each carries a **390px phone pane** at the bottom.

**The pair is one file.** `diff v1.html v1-light.html` returns three lines: the
`data-theme` attribute, the `<title>`, and the mockup's own label bar. Nothing
else. That is the deliverable's main claim made checkable — the page responds to
theme because every colour in it is a semantic token, not because two drawings
were hand-tuned to match.

**The phone pane is cloned, not redrawn.** A five-line script copies `#page` into
a 390px container; the responsive rules are `@container page (…)` rather than
`@media`, so the same markup renders through the same rules at both widths and
the pane cannot drift from the desktop drawing. *(In the build these are
`@media (max-width: 880px)` and `vw` replaces `cqw`. That is the one deliberate
mockup/build divergence, and it exists only so the pane can exist.)*

---

## A. Why the page read as old, and what actually changed

The brief named the cause: raw Tailwind palette colours (`blue-50`, `gray-700`,
`indigo-50`, `text-gray-500`, hardcoded `#0093FF`) instead of semantic tokens, so
the page was effectively light-only. Establishing both themes is the bulk of the
work and most of it is invisible in a screenshot.

The visible half is **rhythm**. The page had eight sections with one rhythm:
centred heading, centred sub, grid of bordered cards. Card soup. The content is
unchanged and in its original order; what changes is that each section now has a
different texture, so the page reads as a sequence rather than a list:

| # | Section | Texture |
|---|---|---|
| 1 | Hero | green card |
| 2 | Reviews | no chrome at all — type on the page ground |
| 3 | Why Nahtadi? | **one** card, five hairline-separated columns |
| 4 | Everything You Need | eight tiles |
| 5 | App Preview | recessed full-bleed band, device frames |
| 6 | FAQ | no cards — hairline disclosure rows, narrow column |
| 7 | Privacy | green card |

## B. The green bookends — the one structural idea

The hero and the privacy section are **the same object**: a rounded card with
`--flagship-bg`, `--flagship-edge`, `--flagship-glow`. That object is
`.home-flagship`, the green band on the Home page — the card the visitor pressed
`The story ›` on to get here. It expands into the page they land on, and closes
it.

**The hero is a card inside `.page-wrap`, not a full-bleed band.** That is a
deliberate choice and it *removes* a deferred problem: a full-bleed dark green
hero reaching under the nav needs adaptive nav link colours, which is the
nav-over-hero item deferred to B6 in `projects/APPROVED.md`. Inside the page
wrap the nav sits on `--surface` in both themes and there is no seam to defer.
At phone width the 20px wrap padding makes it read as near-full-bleed anyway.

**`--flagship-*` is deliberately not overridden in dark.** The band is the same
green in both themes, exactly as the Home flagship band is.

## C. The two component behaviours the brief required

### C1 — ReviewsCarousel height

All six reviews are stacked in **one grid cell** (`grid-area: 1/1`). The
container is therefore permanently as tall as the longest review and never
changes height as they rotate. `min-h-[300px]` is deleted: it was a floor, not a
ceiling, and the reviews run 122–200 characters. No magic number, and adding a
seventh review raises the floor on its own. Same technique the ticker's two tapes
use.

**Measured, not asserted:** clicking through all six dots and reading
`getBoundingClientRect().height` returns one distinct value (270.328125px) for
all six. Short reviews are centred in the cell rather than stranded at the top.

Inactive slides are `visibility: hidden`, so they are genuinely inert — not
focusable, not in the accessibility tree. `visibility` is discrete, so it flips
instantly ON and is delayed by the fade duration OFF. That is the technique
`.nav-menu` already uses in `shared.css`; it is reuse, not invention.

### C2 — A real pause control

Auto-advance is a `setInterval` that could only be stopped by hover or focus, so
on touch there was **no** mechanism — the identical WCAG 2.2.2 gap just closed on
the Home ticker. The control is a permanently visible fourth button in the
existing control row.

- **A real `<button aria-pressed>`, not the ticker's CSS checkbox.** The ticker's
  checkbox works because `HomeTicker` is a server component pausing a CSS
  animation. This carousel is already a client component and its auto-advance is
  a JS interval, which no checkbox can stop.
- **Icon and accessible name flip together** via `display: none`, which removes a
  node from the accessible name computation as well as the page — so the name can
  never say "Pause" while the icon shows a play triangle. Same mechanism as the
  ticker.
- **Glyphs are self-drawn and filled**, as Apple draws transport controls. They
  are *not* members of the five-glyph link-affordance family — a transport
  control is not a link affordance, the same ruling that keeps the ticker's
  glyphs out of `LinkAffordance.tsx`.
- **Hover-pause is deleted; focus-pause is kept.** Hover goes for the reason the
  ticker's went: on touch a tap applies `:hover` and the content freezes until
  you tap elsewhere. Focus stays because auto-advancing content out from under a
  keyboard user who is operating the controls is a real defect, and focus cannot
  misfire on touch. User intent (`paused`) and `focusHeld` are separate state, so
  focus/blur can never resume a carousel the user deliberately paused.
- **Hidden entirely under reduced motion**, where auto-advance is already off —
  a pause button for something that is not moving is a confusing control, and
  leaving it focusable would put a purposeless stop in the tab order. prev/next/
  dots stay; the carousel becomes manual.

## D. Light-theme sky — the 100px rule

**This page has no light-theme haze sky, so the rule has no consumer here, and
that is a finding rather than an omission.** Both large colour surfaces are the
green band, which is theme-agnostic.

The rule exists because a 12px/900 accent eyebrow on `#eef4fb` measures ~4.2:1.
Two things guarantee that cannot happen on this page:

1. **The one eyebrow on the page sits on the green band**, and it is
   `--flagship-meta`, not `--accent` — measured **5.75:1** on the gradient's
   lightest stop.
2. **The one tinted ground on the page carries no accent text at all.** The App
   Preview band is `--surface-sunken` (`#e8e8ed` in light), where `--accent`
   measures **3.85:1** and `--fg-muted` **4.15:1** — both under the floor. So the
   band has no eyebrow, and its captions use `--fg-muted-on-tint` (5.44:1), the
   token that exists for exactly this pairing.

Note the 100px rule is a *top-of-page* rule and must not be applied literally to
a mid-page band: with no 70px nav above it, a 100px tint stop would put a
section's own header copy squarely inside the tint. Not tinting is the correct
answer mid-page.

## E. The one new string on the page: `PRIVACY`

Copy is locked, so the eyebrow is called out rather than slipped in.

The sitewide pattern is eyebrow + statement heading. Four of this page's five
headings are already **labels** that name their own section (`Why Nahtadi?`,
`Everything You Need for Salat`, `App Preview`, `Frequently Asked Questions`) —
an eyebrow over any of them would restate the heading, which `about/APPROVED.md`
forbids outright. Exactly one heading is a **statement** that does not name its
topic: `Nothing leaves your device.` That is precisely the case the eyebrow
pattern exists for, so it gets one and nothing else does.

## F. The price

`COPY-LOCKED` A1 requires the amount to be visible somewhere and names the
`One-Time Purchase` card as the obvious additional place. It appears twice: in
A1's FAQ answer verbatim, and as that card's **value** — set as data under its
own label, so no locked string is touched and the five card titles stay on one
baseline.

## G. Instagram

Removed with the newsletter, per the brief. Recorded in APPROVED.md on approval.

---

## H. New patterns, each justified

Everything else is `.home-tile`, `.pill`, `.section-eyebrow`/`.section-heading`,
`.page-wrap`, the five glyphs, the `contact-enter` entrance and the `[data-reveal]`
system, applied unchanged.

| New | Why it is not drift |
|---|---|
| `.nh-why-card` — one card, five hairline columns | Five facts about one product are one object. Two card grids back to back is the card soup being removed; this is Apple's spec-row pattern, and on phone the vertical hairlines become horizontal ones and the same object becomes a list. |
| `.nh-device` — device frame | The screenshots are raw light-mode iOS captures with no bezel. In dark, six near-white rectangles float with no edge to end at. Identical in both themes: an iPhone is the same object on both grounds. |
| `.nh-q` — hairline disclosure rows | The rhythm break. A list section gets a plain list, per `about/APPROVED.md`. The rotating `+`→`×` is self-drawn and is deliberately **not** a sixth link-affordance glyph: grammar v2 assigns chevron-right to internal navigation, and a disclosure is neither navigation nor a link. |
| `--flagship-tile` / `-edge` / `-hover` | A card sitting ON the green band. `--surface-raised` would flip navy/white between themes on a ground that does not change. Composited white reads as one material in both. |
| `--icon-chip` | Ground for the feature-card icon. Eight large bare-accent glyphs was the loudest thing on the page. Declared as a token rather than an inline `color-mix`, per CLAUDE.md ("any value not in tokens becomes a token first"). |
| `--fg-quiet` | See §T2 — this is a **finding**, not a new idea. |

**This page has no `.pill` instances.** Its actions are the App Store badge, two
tiles, one `mailto:` and the carousel/rail controls. The pill rules are carried in
the mockup so the grammar is visible, not because anything uses them.

---

## T. Audit — run before this went to Omar, per the M1 standing rule

Every figure below is **measured off the rendered page in both themes**, not
computed from the stylesheet.

### T1 — contrast: 40 pairs, all pass

Tightest values: `--accent` review title on `--surface` **4.54** (light); privacy
tile link on the 8% tile over the gradient's lightest stop **4.72**; privacy tile
body **4.86**; footer / section sub **4.91**. Everything else clears comfortably.
Green-band figures are taken against `--color-nahtadi-600` (the 210deg gradient's
0% stop) as worst case; the tiles actually sit lower, where it is darker.

### T2 — one real failure, found and fixed

`.nh-rv-who` (the review byline) used `--fg-faint`, which is `#aeaeb2` in light:
**2.14:1** at 13px/600. `globals.css` warns about this exact value in as many
words — "a separator-glyph colour [that] fails as text". Dark was fine (navy-450,
5.12:1); light was not.

Fixed with `--fg-quiet` = `ink-600` light / `navy-450` dark → **4.91 / 5.12**.

**That pair is now the site's third occurrence.** `--about-when` and
`--contact-quiet` are the same two values under different page-scoped names. N3
should reuse one of them or promote the pair to a shared semantic step — **not
mint a fourth alias.** Flagging it here because the token system has now
rediscovered this step three times.

### T3 — target sizes

Two failures, both fixed. The carousel dots measured **24×9**, failing WCAG 2.5.8
Target Size Minimum on height — *the current build has the same defect* (`h-2.5`).
The hit area is now 44px tall with the visible bar drawn by `::before`, so nothing
about the design moved. The ratings badge measured 41px and is now 45px.

Final: prev/next/pause 44×44 · dots 26×44 · rail buttons 44×44 · badge 237×45 ·
FAQ rows 760×75 · privacy tiles 401×221 · App Store badge 172×57.

### T4 — reduced motion

Rendered under `prefers-reduced-motion: reduce`, not reasoned about. Entrance
`animation-name: none`, `opacity: 1`, `translate: none` — the **end state, never a
paused frame**. Reveals never arm (`data-reveal=""`). `transition-duration: 0s`.
Pause control `display: none`. Auto-advance off.

---

## R. Findings for Omar — calls I made that are his to overturn

1. **The ratings line appeared twice** — the hero badge and again above the
   carousel, the same string within one screen. The hero badge is kept (it is the
   App Store link and the credibility anchor); the carousel's copy is dropped, and
   the five stars on each review card already say 5★. This is the only place I
   removed information. One line to put back.
2. **`Scroll to see more →` and the newsletter section are gone** (E1, H2) and the
   Instagram link went with the newsletter — all three already decided.
3. **`screenshot-4.png` bakes in a stale fact.** Its About panel reads
   `Nahtadi v1.1.0`; §10 of COPY-LOCKED confirms the shipped version is **1.2.1**.
   Removing the stale `v1.1.0` row from `/nahtadi/support` (D10) does not fix a
   number burned into an image. Needs a re-capture, which no mockup can do.
4. **The hero is a card, not a full-bleed band** — §B. The biggest structural call
   here, and the one most worth a second opinion.
5. **`PRIVACY` is one new word of copy** — §E.
6. **`$3.99` appears on the One-Time Purchase card** as well as in A1 — §F.

## Build notes for N3

- Extract the pause/play glyphs to a shared module rather than making a third
  copy; they currently live in `HomeTicker.tsx` and belong beside it, not in
  `LinkAffordance.tsx`.
- The carousel's dots need `type="button"` (they are inside no form today, but
  the default is `submit`).
- `/nahtadi` is not one of the four nav pages, so no nav item is active on it.
  Unchanged from today; recorded so it reads as a decision.
- Spacing used here, offered as candidate steps for the scale sub-project 4 still
  owes: section padding-block **96px** desktop / **64px** phone; band padding
  **88px**; card gaps 16–18px. Do not promote these to a scale until there is a
  second consumer.
