# /nahtadi — APPROVED design contract (N2, 2026-08-28)

**Approved mockups (the visual contract for Task N3):**
- `v4.html` — dark theme (canonical)
- `v4-light.html` — light theme companion
- History: v1 → v3 across four review rounds with Omar; superseded files and their
  notes (`v1-NOTES.md` … `v4-NOTES.md`) kept for reference. `v4-NOTES.md` carries
  the measurements behind everything below.

**The single-file pair is a PROPERTY TO PRESERVE, not an accident of authoring.**
`diff v4.html v4-light.html` returns exactly three lines: the `data-theme`
attribute, the `<title>`, and the mockup's own label bar. Every colour on the page
is a semantic token, so theme parity is **structural rather than hand-matched** —
the two themes cannot drift, because there is only one drawing. The build inherits
this by using tokens for every colour; if a hex literal appears in N3's CSS, that
property has been lost.

**Why this page needed redesigning at all:** it used raw Tailwind palette colours
(`blue-50`, `gray-700`, `indigo-50`, `text-gray-500`, hardcoded `#0093FF`) instead
of semantic tokens, so it did not respond to theme and was effectively light-only.

---

## Page structure (locked, in order)

1. **Hero** — green flagship card. White icon tile (128px, radius 24px) · ratings
   badge linking to the App Store · `Nahtadi` (Roboto 900) · `Islamic Prayer Times`
   in `--flagship-meta` · the brand line · the official **Download on the App
   Store** badge, unmodified. This is the one page the official badge appears on,
   per the projects contract.
2. **App Preview** — `--surface-sunken` card. Heading + sub + a horizontally
   scrolling rail of six device-framed screenshots with prev/next controls.
3. **Reviews** — `--surface-raised` card. Six App Store reviews, one at a time,
   with prev/next, dots and a pause control.
4. **Why Nahtadi?** — page ground, uncontained. Heading + sub + **one** card of
   five hairline-separated cells (No Ads · No Data Collection · One-Time Purchase ·
   Works Offline · Muslim-Built). The One-Time Purchase cell carries `$3.99` as a
   value under its own label.
5. **Everything You Need for Salat** — page ground, uncontained. Heading + sub +
   eight feature tiles (`.home-tile`), 4 columns.
6. **Frequently Asked Questions** — `--surface-raised` card. Four hairline-separated
   `<details>` rows with a rotating `+` → `×` mark.
7. **Privacy** — green flagship card. Eyebrow `PRIVACY` · `Nothing leaves your
   device.` · sub · two **white** tiles (Privacy Policy, App Support), each a link
   with a green action pill · `Questions or feedback?` + `support@hendaseh.com`.

Then the standard footer.

**Cut from the page (already ruled, see COPY-LOCKED.md):** the newsletter section
and its `EmailSignup` component (H2), the `Scroll to see more →` line (E1), and the
`@Hendaseh` Instagram link, which lived inside the newsletter section.

---

## Structural decisions, and the reasoning that must survive

### The hero is a CARD, not a full-bleed band

It is **the same object as Home's flagship band** — `--flagship-bg`,
`--flagship-edge`, `--flagship-glow`, radius 22px — which is the card the visitor
pressed `The story ›` on to get here. It expands into the page it opens, and the
privacy card closes it. Green bookends.

It also **removes** a deferred problem instead of adding one. A full-bleed dark
green hero reaching under the nav needs adaptive nav link colours, which is the
nav-over-hero item deferred to B6 in the projects contract. Inside `.page-wrap` the
nav sits on `--surface` in both themes and there is no seam to defer. Do not
"improve" this into a full-bleed hero.

### Screenshots sit directly after the hero

The App Store puts screenshots immediately after the title. That is the format
every visitor arriving from the listing already knows, and **for an app the
screenshots are the proof.** Before this, a visitor read reviews and feature copy
before seeing what the thing looks like.

### ROUNDED CARDS, NEVER FULL-BLEED BANDS

An earlier revision built these regions as square full-bleed bands. That was wrong
twice over: no other page on the site uses full-bleed regions (Home's flagship band
and CTA card are `rounded-[22px]`; every grid everywhere is `.home-tile`), and in
dark it made the page read flat — three near-black grounds striped across the
viewport give the eye no edge to catch.

**The measurement that produced this rule.** Contrast between the three surface
tokens:

| pairing | light | dark |
|---|---|---|
| `page \| sunken` | 1.182 | **1.013** |
| `page \| raised` | **1.034** | 1.114 |
| `sunken \| raised` | 1.221 | 1.128 |

`sunken|raised` is the only pairing that reads in both themes. A band set against
the page ground carries in one theme and vanishes in the other, **so a ground delta
alone can never carry a boundary.** Ground must travel with an edge — which is
`.home-tile`'s own recipe (1.034 plus a hairline), and is how the built light theme
already separates every card from the page.

**That argues for ground plus hairline. It never argued for full-bleed.**

### Five regions, their grounds and their containers

| # | Region | Container | Ground |
|---|---|---|---|
| 1 | Hero | rounded card | `--flagship-bg` + `--flagship-edge` |
| 2 | App Preview | rounded card | `--surface-sunken` + `--edge` |
| 3 | Reviews | rounded card | `--surface-raised` + `--edge` |
| 4 | Why Nahtadi? | **page column, uncontained** | page |
| 5 | Everything You Need | **page column, uncontained** | page |
| 6 | FAQ | rounded card | `--surface-raised` + `--edge` |
| 7 | Privacy | rounded card | `--flagship-bg` + `--flagship-edge` |

**4 and 5 deliberately share a ground and neither is contained.** They are one
argument — why the app exists, then what it does — and **proximity is how that gets
said.** It is the same shape Home's WORK section already has: eyebrow, heading and
tiles directly on the page ground. Do not give either one a card.

**Card values are Home's, and none was minted:** radius **22px** and padding
**42px** from `HomeFlagship` / `HomeCTA`; the hero icon tile's **24px** is
`HomeFlagship`'s own tile radius at its small size. Two minted values were removed
during review — a 28px hero radius and a 24px Why-card radius sitting one step off
the region cards at the same visual scale.

---

## Spacing

| | desktop | phone (≤880) |
|---|---|---|
| Between region cards | **80px** (40 + 40) | **64px** (32 + 32) |
| Within region (4 → 5) | **48px** (24 + 24) | **40px** (20 + 20) |

**Why 80px and not Home's 160px.** Boxes make space legible. On Home the space
between sections is unbounded, so the eye reads rhythm rather than a gap and 80px a
side (`py-20`) is right. Here two rounded card edges turn the same air into a
**measurable distance**, and the edge does the separating that the space used to do
alone — so the space gives some back.

**Why within-region was NOT halved as far.** Why and Features are *uncontained*
sections with no edges at all, so **air is their only separator** and has to carry
more of the work than it does between two cards. The ratio is **1:1.67, not 1:2**,
and that is deliberate. Tightening it to 1:2 would make two full headed sections
collide.

Every value already exists in the codebase (40 and 56 in `about.css`, 32 is Home's
mobile `p-8`, 20 is `page-wrap`'s phone inset). They were picked by drawing, not by
arithmetic. **No section starts at 0 padding.**

---

## Colour rules this page produced

- **Ground never travels alone.** Every region boundary is a ground change **and**
  a hairline. See the measurement above; this is not stylistic.
- **FAQ row hairlines take `--edge`, never `--edge-soft`.** On the dark raised
  ground `--edge-soft` (`#0d1e33` on `#0b1c30`) measures **1.023** — invisible — and
  this is a section whose entire structure *is* its hairlines. `--edge` reads 1.506
  light / 1.662 dark.
- **Green-on-green is a defect, and the fix is the rule that already exists.** Cards
  sitting on the green band take the **solid white tile**, per the contrast rule
  `home/APPROVED.md` generalized on 2026-08-26 for the arch icon: a tile on this
  band must CONTRAST its ground, and *"green-on-green was the blend bug."* Apple's
  own version: never stack a light translucent surface on another. Measured: white
  is **7.57:1** against the band's lightest stop (`#0f5f50`), far above the 3:1
  non-text floor. An earlier revision used a translucent white tile and blended.
- **Ink on a white tile comes from the band's own palette, never `--fg-*`.** The
  card is theme-agnostic because the band is; `--fg-*` would put navy-200 body text
  on a white card in dark. Title, body and action all take `--flagship-pill-fg`.
- **The privacy/support ACTIONS are Home's flagship pill, INVERTED.** The same two
  tokens swapped: a white pill with green ink on the band becomes a **green pill
  with white ink** on a white card. Same contrast rule, applied to an action instead
  of an icon. **Nothing is minted**, and white on `nahtadi-700` measures 12.33:1.
- **The App Preview card carries no accent text and no eyebrow.** On
  `--surface-sunken` in light (`#e8e8ed`), `--accent` measures 3.85 and `--fg-muted`
  4.15 — both under the floor. Its captions use `--fg-muted-on-tint` (5.44:1), the
  token that exists for exactly this pairing.
- **The light-theme 100px sky rule has no consumer here**, and that is a finding
  rather than an omission: both large colour surfaces are the green band, which is
  theme-agnostic, and the page's one eyebrow sits on it in `--flagship-meta`
  (5.75:1), not `--accent`. Note the 100px rule is a *top-of-page* rule and must not
  be applied to a mid-page band — with no 70px nav above it, a 100px tint stop puts
  a section's own header copy inside the tint.

---

## Tokens

**Four new values were proposed during review; three were collapsed** after
rendering each one against the existing token it could reuse. In every case the
existing token was as good or better. This method is the contract as much as the
result: **draw the comparison, do not reason about it.**

| Proposed | Outcome |
|---|---|
| `--flagship-card-body` | **Deleted → `--flagship-pill-fg`.** `nahtadi-600` read as a second, hue-shifted *green* rather than as body text; one ink with hierarchy from size and weight (18/700 against 14/400) is how a card is set. Contrast **7.57 → 12.33**. |
| `--flagship-card-shadow` | **Deleted → `--nahtadi-tile-shadow`**, already this site's shadow for a white tile on this exact green band, and visibly the better one — softer and deeper where the new value read tight. |
| `--flagship-card-shadow-hover` | **Deleted.** Imperceptible under a `0 26px 60px rgb(0 0 0/.5)` shadow; the −6px lift carries the hover on its own. |
| `--icon-chip` | **KEPT** — the one genuinely new value on the page. |

### N3 inherits two token obligations

1. **`--icon-chip` needs a home in `globals.css` AND `/dev/tokens`** before the page
   is built — `rgb(0 113 227 / .10)` light, `rgb(87 180 255 / .12)` dark. It is the
   ground for the feature-card icon; eight large bare-accent glyphs were the loudest
   thing on the page. The standing rule is that any value missing from the scale
   becomes a token **first**, never an inline `color-mix` or magic value.
2. **`--fg-quiet` is a PROMOTION, not a new token.** It is the **third** use of the
   `ink-600` / `navy-450` pair, alongside `--about-when` and `--contact-quiet`.
   Promote it to a shared semantic step and repoint the other two. **Never mint a
   fourth alias.** It exists because the review byline on `--fg-faint` measured
   **2.14:1** in light — the value `globals.css` itself warns is *"a separator-glyph
   colour [that] fails as text."*

---

## Component behaviours — BINDING ON N3

### 1. ReviewsCarousel height

**Every review is stacked in ONE grid cell** (`grid-area: 1/1`), so the container
sizes to the tallest permanently and **never changes height as they rotate**.
Measured: one distinct height, **270.328125px**, across all six.

**`min-h-[300px]` is removed.** It was a floor, not a ceiling — the reviews run
122–200 characters, taller ones pushed past it, and everything below the carousel
jumped. There is no magic number in the replacement: add a seventh review and the
floor rises on its own. Same technique the Home ticker's two tapes use.

Slides cross-fade (opacity, ~320ms). Inactive slides are `visibility: hidden`, so
they are genuinely inert — not focusable, not in the accessibility tree.
`visibility` is discrete, so it flips instantly ON and is delayed by the fade OFF;
that is the technique `.nav-menu` already uses in `shared.css`. Short reviews are
centred in the cell rather than stranded at the top.

### 2. The pause control

**A real `<button aria-pressed>`, NOT the Home ticker's CSS checkbox.** The
ticker's checkbox works because `HomeTicker` is a server component pausing a CSS
animation; this carousel is already a client component and its auto-advance is a
`setInterval`, which **no checkbox can stop.**

**Why it exists:** the carousel auto-advances, never stops, and had no
touch-reachable pause — the identical **WCAG 2.2.2 (Pause, Stop, Hide, Level A)**
gap closed on the Home ticker.

- **Icon and accessible name flip together** via `display: none`, which removes a
  node from the accessible name computation as well as the page, so the name can
  never say "Pause" while the icon shows a play triangle.
- **Glyphs are self-drawn and filled**, as Apple draws transport controls. They are
  **not** members of the five-glyph link-affordance family — a transport control is
  not a link affordance, the same ruling that keeps the ticker's glyphs out of
  `LinkAffordance.tsx`.
- **Hover-pause is DELETED**, for the reason the ticker's was: on touch a tap
  applies `:hover` and the content freezes until the user taps elsewhere.
- **Focus-pause is KEPT**, as state separate from user intent, so focus/blur can
  never resume a carousel the user deliberately paused. Auto-advancing content out
  from under a keyboard user operating the controls is a real defect, and focus
  cannot misfire on touch.
- **Hidden entirely under `prefers-reduced-motion`**, where auto-advance is already
  off. A pause button for something that is not moving is a confusing control, and
  leaving it focusable would put a purposeless stop in the tab order. prev/next and
  the dots remain; the carousel becomes manual.

### 3. The screenshot rail — LEFT-ALIGNED

`scroll-snap-align: start`. Leading and trailing insets are **the card's normal
inner inset** (42px desktop / 22px phone) — **never a centring calculation.** This
is also what the App Store's own rail does: it begins at the content edge and
scrolls right.

**Two bugs were fixed here. Record both so neither returns.**

**(a) The centring calc.** `padding-inline` was `calc(50% - 105px)`, i.e.
`(clientWidth − itemWidth) / 2`, which centres the first and last item and **is**
the dead space at both ends, by construction. Measured leading padding before the
fix: 61.5px at 390, **214.5px at 720**, 42px at 1024 and above — the calc lived in
the sub-880 rule, so it bit from 390 up to 880 (half-laptop widths) and stopped
there.

**(b) The snapport.** `scroll-snap-align: start` snaps to the **snapport**, which
is the scroll container's **padding box** — not its content box. So the browser
snapped the first item to the padding-box edge on load and **scrolled the leading
inset away**: the first screenshot sat at the card's inner *border* edge (x=186)
instead of its *content* edge (x=228), where the heading starts.
**`scroll-padding-inline` fixes it, and MUST TRACK `padding-inline` AT EVERY
BREAKPOINT.**

**N3 REQUIREMENT — an e2e assertion that the first screenshot's left edge equals
the card's content edge at several widths.** Nothing currently couples
`scroll-padding-inline` to `padding-inline`, and that single check catches **both**
bugs above. Verified in the mockup at 390 / 500 / 720 / 880 / 1024 / 1280 / 1440 /
1728: leading padding takes exactly two values, never scales with viewport, and
both leading and trailing insets are **0px at every width**. A single-width check is
what let the original defect through.

---

## Rejected — DO NOT REOPEN

- **More emphasis on the hero's 5.0 star rating.** The rating inherits the Home
  flagship band's `--flagship-meta` treatment. It was raised that on a product page
  5.0 stars is arguably a headline asset rather than a meta detail. **Omar declined:
  "quiet" is contractual and this would not be a free change.**
- **A link COLOUR on the privacy/support tiles.** Those tiles are already `<a>`
  elements carrying `link-glyph link-glyph-chevron`; **the site's link signal is the
  GLYPH, not colour** — Contact's channel cards work identically with
  arrow-up-right and arrow-down-in-circle and no coloured text. A colour would
  introduce a signal no other page uses, on the one page being made consistent with
  the others, and `#0071e3` clashes on a dark green band. The signal was
  strengthened with the inverted flagship pill instead.
- **The full-bleed exception for the rail.** Permitted, not taken. The card's rounded
  edge cuts the peeking screenshot exactly as a viewport edge would, so the
  affordance is identical — and taking it would have left the one section named as
  feeling unlike the rest of the site as the one section that stayed unlike it. The
  projects chip-row precedent differs in kind: on a phone the page column **is** the
  viewport, so there is no card edge to cut against.
- **Carousel dots at 26×44 — an accepted constraint, not a defect.** They clear WCAG
  2.5.8's 24×24 minimum with non-overlapping spacing. Widening them to 44 overflows
  the control row at 390px. The 44px is on the height axis only; do not "fix" this.

---

## Copy

**Copy is locked in `COPY-LOCKED.md`. The mockup lifts it verbatim, and N3 builds
FROM THAT DOCUMENT, not from the mockup.** Where the two ever disagree,
`COPY-LOCKED.md` wins.

- **The `PRIVACY` eyebrow is Amendment 3 / row A23** — the only row in that document
  that **adds** a string rather than replacing one. It exists because four of the
  five headings are already labels naming their own section, and About's contract
  forbids an eyebrow identical to its heading; exactly one heading (`Nothing leaves
  your device.`) is a statement that does not name its topic, which is the case the
  eyebrow pattern exists for. One eyebrow on the page, and no others.
- **A1 stays as approved — do not revert it.** It feeds the FAQPage JSON-LD, which
  Google surfaces **detached from the page**, where the One-Time Purchase card does
  not exist. An answer to "Why isn't it free?" that never states the price would be
  priceless again in exactly the context Amendment 1 was written to fix. The price
  therefore lives in the answer itself **and** on the card; they are additive.

---

## Instagram

**The `@Hendaseh` link is removed with the newsletter section.** The account exists
but has **no content**, and *"Proof, not promises"* governs.

**When it becomes active it returns at SITE level** — Contact's channel list and/or
the footer — **not on `/nahtadi`.** It is a brand account spanning multiple apps,
not a Nahtadi channel, so `/nahtadi` is the wrong home for it either way.

---

## Mobile rules (sub-880) — explicit, not implementer judgment

"Implementer judgment" mobile layouts stopped being acceptable after M1's phone
review. These are contractual:

- **Region cards:** `padding: 32px 22px` (Home's `max-[880px]:p-8`), radius 22px
  unchanged. `page-wrap` inset drops to 20px at ≤640.
- **Section rhythm:** 32px a side between regions; 20px within region (4 → 5).
- **Hero:** `padding-block: 56px 52px`; icon tile 104px at radius 24px.
- **Why card:** collapses to one column; cells become left-aligned rows at
  `20px 22px` with **horizontal** `--edge` hairlines (`border-top`, none on the
  first); the price drops to 24px.
- **Feature grid:** 4 columns → **2 at ≤1000** → **1 at ≤880**, gap 12px. Tiles
  become a compact horizontal layout (icon left, text right, `18px 20px`) — **never
  full-width sprawl**, per the Home contract's mobile rules.
- **Rail:** gap 18px, `padding-inline` **and** `scroll-padding-inline` both 22px,
  items 210px, device frame radius 36px / padding 7px, scroll buttons inset 4px.
- **FAQ:** summary 16px at `20px 2px`; body 15px.
- **Privacy:** card `padding-block: 48px 44px`; tiles stack to one column, gap 12px,
  `padding: 22px 20px`.
- **Footer:** stacks and centres at ≤640.
- **Verified at 390px:** no horizontal overflow, rail leading inset 0, action pill
  175×44.

---

## Build notes for N3

- **`/nahtadi/privacy` and `/nahtadi/support` get NO mockup.** They are documents
  and go straight to N3 with token adoption, glyph grammar v2, entrance animations
  and the locked copy.
- **Frozen URLs. Zero changes to canonical tags, the sitemap, or redirects.** The
  App Store links to `/nahtadi`, `/nahtadi/privacy` and `/nahtadi/support`. All
  metadata and JSON-LD changes come from `COPY-LOCKED.md` only.
- **The blocking pre-ship gates in `COPY-LOCKED.md` §9 still apply**, including
  running `npm run test:all` rather than assuming — H1 and H2 both touch tested
  surfaces.
- **Screenshot staleness: CLOSED 2026-08-29.** All six binaries were re-captured
  from the live app at **v1.2.1** and are recorded in `COPY-LOCKED.md` Amendment 5.
  Slot 6 changed meaning (Offline Mode → the guided setup) and took a new caption,
  row **K1**; the other five keep their captions. Resolution moved `1320x2868` →
  `1206x2622`, an aspect-ratio change of 0.1% that the `object-fit: cover` device
  frame absorbs — **no layout consequence, no mockup revision.**

**The approved mockups now show STALE CAPTIONS, and that is expected.** `v4.html`
was drawn before J1 and K1 were locked, so it still renders slot 3 as `Choose the
method your region follows.` and slot 6 as `Offline Mode` / `Works without internet,
using your last known location.` — the latter now sitting over an onboarding
screenshot. **Do not "fix" the mockup and do not build from it.** The precedence rule
in *Copy* above already governs: `COPY-LOCKED.md` wins, and N3 builds from the rows
(J1 for slot 3, K1 for slot 6). Verified 2026-08-29 that the new binaries render in
the approved device frame with **zero** crop (rendered ratio 0.4604 against the
frame's 0.4604) and a leading inset of 0px, so the mockup remains an accurate
*visual* contract even where its caption text is superseded.

### Screenshot capture recipe

Re-shooting should be a repeat of steps, not a fresh afternoon.

Device: **iPhone 17 Pro simulator, iOS 26.5** — the same device the app's own CI
uses, so the captures match what is tested.

```
xcrun simctl privacy    <udid> grant location com.omaryounis.Nahtadi
xcrun simctl location   <udid> set 37.3688,-122.0363          # Sunnyvale
xcrun simctl ui         <udid> appearance light
xcrun simctl status_bar <udid> override --time "9:41" --batteryState charged \
    --batteryLevel 100 --cellularMode active --cellularBars 4 --wifiMode active \
    --wifiBars 3
xcrun simctl io         <udid> screenshot <path>              # full-res 1206x2622
```

**THE RULE THAT MATTERS MORE THAN ANY SINGLE STEP: all six must share one city, one
date and one appearance.** A set where the Qibla points one way and the prayer times
belong to a different city falls apart under any careful look, and that is the
failure nobody can name but everyone feels. The 2026-08-29 set holds it — slot 1
`Sunnyvale, CA` / `August 29, 2026`, slot 2 bearing `19.3°` which is correct for
Sunnyvale, slot 3 `Detected country: United States`, all six light with a `09:41`
status bar. **Check this across the set before committing, not per image.**

**NEVER screenshot the About panel.** It displays the app version, which is the exact
staleness trap that put `v1.1.0` into the old set and forced this whole workstream.
It sits directly below `Set Up Again` in `SettingsView`, so it is easy to catch by
accident when shooting Settings — frame slot 5 above it.

**Known artifact, accepted.** `status_bar override` fakes the status bar only; the
app's own clock stays real. In the current set slot 1 shows `09:41` with a Dhuhr
countdown of `01:52:52` against a 13:10 Dhuhr, which implies a real capture time
around 11:17. Apple's own marketing shots carry the same mismatch. If it ever needs
to be exact, capture near the real 9:41 rather than trying to fake both.
- **Entrance:** the established pattern — `0.6s var(--ease-brand) var(--enter-delay)
  both`, riding on `translate`, never `transform`. Six hero beats: icon `0s`, badge
  `.1s`, title `.2s`, kicker `.28s`, sub `.36s`, App Store badge `.46s`. Below the
  fold uses the existing `[data-reveal]` / `ScrollReveal` system, applied to the
  region cards. **Reduced motion is fully static — the end state, never a paused
  frame.**
- **Extract the pause/play glyphs to a shared module beside `HomeTicker.tsx`**,
  never into `LinkAffordance.tsx`.
- **The privacy action pill is a `<span>` inside the card's `<a>`** — never a nested
  `<a>` or `<button>`. The card is the link (a 401×242 target, and these are the
  links the App Store requires to be reachable); the pill is presentational. The
  Projects contract's *"whole card is NOT the link; actions are explicit pills"*
  governs cards with **two** actions, where one link cannot express both. These have
  one each, which is Contact's case. Use `display: inline-block`, **not**
  `inline-flex` — flex makes each text node a flex item and collapses the space,
  rendering `GetSupport`.
- **Carousel dots need `type="button"`.**
- `/nahtadi` is not one of the four nav pages, so **no nav item is active** on it.
  Unchanged from today; recorded so it reads as a decision.
- **Card hover is SHARED CODE**, per the sitewide rule: the feature tiles use the
  built `.home-tile`. The privacy tiles carry their own class only because
  `.home-tile`'s ground is `--surface-raised`, which would flip navy in dark on a
  band that does not change — they reuse its exact curve, duration and −6px.
- **Spacing values are offered as candidate steps for the scale sub-project 4 still
  owes** (region rhythm 40px a side, within-region 24px, card padding 42px / 32px 22px).
  All are pre-existing values. **Do not promote them to a named scale until there is
  a second consumer.**
- **Both themes**, per the approved pair. All Apple-calibration rules from the Home
  contract apply (pills, contrast floors, hairlines, press feedback).
