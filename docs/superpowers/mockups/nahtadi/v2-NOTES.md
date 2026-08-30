# N2 v2 — /nahtadi mockup notes

**Supersedes `v1-NOTES.md`.** v1 is kept for history; everything it recorded that
still stands is restated here, so this file is self-contained.

**Files:** `v2.html` (dark, canonical) · `v2-light.html` (light companion). Each
carries a **390px phone pane**.

The pair is still one file — `diff` returns three lines (`data-theme`, `<title>`,
the mockup's own label bar). The phone pane is still cloned from the desktop
markup through container queries. Neither property was touched by this round.

---

## What changed from v1

Omar approved the direction and the hero-as-a-card structural call. Four changes.

### 1. App Preview moved to directly after the hero

`hero → shots → reviews → why → features → faq → privacy`.

The App Store puts screenshots immediately after the title, so it is the format
every visitor arriving from that listing already knows — and for an app the
screenshots **are** the proof. Previously a visitor read reviews and feature copy
before seeing what the thing looks like.

### 2. Section rhythm — measured, then rebuilt

**The complaint was real and it was measurable.** v1 ran reviews → why →
features on one ground, with `features` at `padding-block: 0 96px`, and
`.nh-shots` was the only section carrying a ground of its own. One section out of
seven did all the separation work.

**The measurement that drove the fix.** Contrast between the three surface
tokens:

| pairing | light | dark |
|---|---|---|
| `page \| sunken` | 1.182 | **1.013** |
| `page \| raised` | **1.034** | 1.114 |
| `sunken \| raised` | **1.221** | **1.128** |

`sunken|raised` is the **only** pairing that reads in both themes. A band set
against the page ground carries in one theme and vanishes in the other — so
ground alone can never be trusted. An `--edge` hairline measures **1.46–1.88 at
every one of those boundaries**, always more than the ground delta it sits on.
Ground and hairline therefore travel together. That is not a new rule: it is how
the built light theme already separates a card from the page (1.034 plus a
hairline).

**Five regions, and the strongest available seam is spent on the biggest turn:**

| # | Section | Ground | Region |
|---|---|---|---|
| 1 | Hero | page + green card | the pitch |
| 2 | App Preview | `sunken` | **the proof** — `sunken\|raised` between 2 and 3 is |
| 3 | Reviews | `raised` | the page's strongest seam, in both themes |
| 4 | Why Nahtadi? | page | **the case** — one region, one ground, so the |
| 5 | Everything You Need | page | shared ground *is* the grouping signal |
| 6 | FAQ | `raised` | the answers |
| 7 | Privacy | page + green card | the close |

4 and 5 deliberately share a ground: "why it exists" and "what it does" are one
argument, and proximity is how that gets said. Apple's own point — material
separates structural regions, spacing alone neither groups nor divides — cuts
both ways, so where the material does *not* change the air has to be real.

**Spacing follows from that.** Where the ground changes, the band edge is the
boundary, so 80px inside each side reads as 80px. Where it does not (4|5), the
gap is the only signal: 48 + 48 = 96px. **No section starts at 0 padding any
more.** Phone: 56px bands, 32 + 32 within-region.

Two consequences worth recording:

- Banded sections had to become full-bleed with `.page-wrap` **inside** them, the
  structure `.nh-shots` already used. On `page-wrap` itself the ground stops at
  the 1120px column.
- **The FAQ's row hairlines moved from `--edge-soft` to `--edge`.** On the raised
  ground `--edge-soft` is `#0d1e33` on `#0b1c30` — **1.023**, invisible. On a
  section whose entire structure *is* its hairlines that is fatal. `--edge` reads
  1.506 light / 1.662 dark.

No new ground token was minted; the scheme uses `--surface`, `--surface-raised`
and `--surface-sunken` only.

### 3. Green-on-green fixed

The privacy cards took a translucent white tile — a light surface stacked on the
band, which is what `home/APPROVED.md`'s generalized contrast rule
("**green-on-green was the blend bug**") and Apple's "never stack a light
translucent surface on another" both forbid.

They now take **the same treatment the arch icon's tile already gets on this
band: a solid white tile.** The established `--flagship-pill-bg` /
`--flagship-pill-fg` pair, so no new treatment and no new colour.

**Measured:** the white tile is **7.57:1** against the band's lightest stop
(`#0f5f50`) — far above the 3:1 non-text floor, so it contrasts rather than
blends. Ink comes from the band's own palette rather than the neutral ladder,
because the card is theme-agnostic and `--fg-*` would put navy-200 body text on a
white card in dark: **title and link `nahtadi-700` 12.33:1, body `nahtadi-600`
7.57:1.** The focus ring went from white (invisible on a white card) to
`--flagship-meta`.

Hover keeps `.home-tile`'s exact curve, duration and −6px; only the ground
differs, and only because `--surface-raised` would flip navy in dark on a band
that does not change.

### 4. The star stays quiet — recorded, closed

The hero rating inherits the Home flagship band's `--flagship-meta` treatment.
**It was raised that on a product page 5.0 stars is arguably a headline asset
rather than a meta detail. Omar declined: "quiet" is contractual and this would
not be a free change.** Recorded so a later pass does not "improve" it. This is a
decision, not an oversight.

---

## Carried forward from v1, unchanged

- **The green bookends.** Hero and privacy are the same object — `.home-flagship`,
  the green card the visitor pressed `The story ›` on to get here. Drawing the
  hero as a card inside `.page-wrap` also removes the nav-over-hero seam deferred
  to B6 rather than adding a third instance of it.
- **C1 — carousel height.** All six reviews in one grid cell; the container is
  permanently as tall as the longest and never changes as they rotate.
  `min-h-[300px]` deleted. Re-verified on v2: one distinct height, 270.328125px,
  across all six. Inactive slides are `visibility: hidden`, so they are genuinely
  inert — the technique `.nav-menu` already uses.
- **C2 — the pause control.** A real `aria-pressed` button, not the ticker's CSS
  checkbox, because no checkbox can stop a `setInterval`. Icon and accessible name
  flip together via `display: none`. Self-drawn filled transport glyphs, not
  members of the five-glyph link family. Hover-pause deleted (the touch `:hover`
  trap); focus-pause kept, as separate state from user intent, so focus can never
  resume a carousel the user paused. Hidden entirely under reduced motion.
- **The one new string is still `PRIVACY`** — see the carry-forward below. Four of
  the five headings already name their own section; only
  `Nothing leaves your device.` is a statement that does not, which is exactly the
  case the eyebrow pattern exists for.
- **`$3.99`** on the One-Time Purchase card, set as data under its own label so no
  locked string is touched and the five titles stay on one baseline.
- **Instagram** removed with the newsletter.
- `--fg-quiet`, `--icon-chip`, `.nh-why-card`, `.nh-device`, `.nh-q` — all
  justified in `v1-NOTES.md` §H and unchanged. `--flagship-tile*` is **deleted**;
  change 3 replaced it with the existing white-on-flagship pair plus two shadow
  steps.

---

## Audit — re-run on v2, both themes, before review

- **Contrast: 29 pairs per theme, zero failures.** Tightest: `--accent` review
  title on `--surface-raised` **4.70** light; privacy card body on white **7.57**;
  footer and features sub **4.91**; shots captions on the sunken band **5.44**
  (via `--fg-muted-on-tint`, since `--accent` is 3.85 and `--fg-muted` 4.15 there
  — that band still carries no accent text and no eyebrow). Green-band figures are
  taken against the gradient's 0% stop as worst case.
- **Targets:** prev/next/pause 44×44 · dots 26×44 · rail buttons 44×44 · badge
  237×45 · privacy cards 401×219. All ≥44.
- **Reduced motion, rendered not reasoned:** entrance `animation-name: none`,
  `opacity: 1`; privacy-card `transition-duration: 0s`; pause control
  `display: none`; reveals never armed.
- **No regression on the keep-list:** single-file pair intact, 8 `.home-tile`,
  the glyph family, `.section-eyebrow`, 9 `.page-wrap`, `--flagship-bg`, six
  `--enter-delay` beats, `--ease-brand`, phone pane at 390px. Dark tokens still
  byte-identical to `globals.css`.

---

## Carry-forward for N3 — two items that need a ruling

### 1. `PRIVACY` must land in COPY-LOCKED.md as an amendment

It is new copy that exists only in this mockup. If it ships without an amendment
row, `COPY-LOCKED.md` stops being the single source of truth for this page — which
is the one property that document is for. **N3 must not implement it until the
amendment exists.**

### 2. Should A1 revert? Recommendation: **NO — keep the amended wording**

A1 was amended solely to make `$3.99` visible content, and the One-Time Purchase
card now does that in a better place. Reverting would shrink the delta from Omar's
originally-approved copy by six characters, which is a real argument.

**But A1 feeds the FAQPage JSON-LD.** Google can surface that Q&A as a rich result
detached from the page, where the card does not exist — so an answer to
"Why isn't it free?" that never states the price would be priceless again in
exactly the context Amendment 1 was written to fix. COPY-LOCKED's own reasoning
says the same thing from the other side: "a pricing answer that never states the
price is odd on its own terms."

The card is **additive, not a replacement**. Six characters buys correctness in
the detached context, and the ledger's "`offers.price` and A1's `$3.99` move
together, always" pairing stays intact. Omar's call, but the recommendation is to
leave A1 as approved.

### 3. Not blocking — screenshot staleness

`screenshot-4.png` bakes in `Nahtadi v1.1.0`; the shipped version is 1.2.1 (§10 of
COPY-LOCKED). Removing the stale support-page row does not fix a number burned
into an image. Separate workstream, needs a re-capture from the app. The current
images stand as placeholders and do not block this mockup.

## Build notes for N3

- Extract the pause/play glyphs to a shared module rather than making a third
  copy; they live in `HomeTicker.tsx` and belong beside it, not in
  `LinkAffordance.tsx`.
- The carousel dots need `type="button"`.
- `--fg-quiet` is the site's **third** copy of the `ink-600` / `navy-450` pair
  (`--about-when`, `--contact-quiet`). Reuse or promote it; do **not** mint a
  fourth alias.
- `/nahtadi` is not one of the four nav pages, so no nav item is active. Unchanged
  from today, recorded so it reads as a decision.
- Spacing used here, offered as candidate steps for the scale sub-project 4 still
  owes: bands **80px** desktop / 56px phone; within-region **48px** / 32px. Do not
  promote to a scale until there is a second consumer.
