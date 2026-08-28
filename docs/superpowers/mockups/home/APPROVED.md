# Home — APPROVED design contract (M1 complete, 2026-08-26)

**Approved mockups (the visual contract for Task B1):**
- `v11-final.html` — dark theme (canonical)
- `v11-final-light.html` — light theme companion
- (v9/v10 pairs superseded; v11 = full Apple-audit pass)
- History: v1 directions → v9 across 9 iterations with Omar; superseded files kept for reference.

## Page structure (locked, in order)

1. **Hero** — aurora + starfield sky; **swarm cluster**: Hendaseh hexagon tile pinned at center, 7 project icons (squircle assets) at varied sizes/radii revolving **clockwise as one group**, icons counter-rotated to stay upright, full lap ≈ 60s; staggered pop-in on load. Below: `Omar Younis` (Roboto 900), tagline `Software Engineer · iOS, ML & Autonomous Systems` (tagline segment in blue), CTAs `View projects` (primary) + `Résumé (PDF)`. **No availability line. No radar sweep. No orbit rings/guides.**
2. **Ticker** — full-width moving tape (~30s loop per sequence, **paused by an explicit control — no hover-pause**, see the divergences below, `aria-hidden` on the tape, static under reduced motion): quiet monochrome pairs + uncostumed real stats. Items (**8 since 2026-08-27** — see the divergence below): SWIFT/SWIFTUI · PYTORCH/TENSORFLOW · CUDA/C++ 35.31× · PYTHON/NUMPY · 1.5B LLM ON A16 · APP STORE 5.0★ · AWS 1M+ DATA POINT/MIN · MECHANICAL 7 YRS. **No stock-price styling, no green gains.**
3. **Flagship band** — eyebrow `FLAGSHIP`, heading `Shipped, and live today.`; green-gradient card (Nahtadi brand gradient), Nahtadi icon **on a WHITE tile** (rule generalized 2026-08-26: the transparent arch icon's tile must CONTRAST its ground — white on the green band or any green/dark ground; a green tile is only for grounds of a DIFFERENT hue/luminance. Green-on-green was the blend bug; green-on-dark-navy is fine — which is why the hero swarm satellite keeps its green tile in BOTH themes: the swarm family is colorful tiles, and a lone white satellite would break it), meta line `LIVE ON THE APP STORE · 5.0★ · PRIVACY-FIRST`, description, white `The story →` button → `/nahtadi`.
4. **Work grid** — eyebrow `WORK`, heading `Proof, not promises.` **Tier-semantic sizes:** two horizontal feature tiles (showcase tier: brent-cuda, collision-avoidance-radar) with full **uncropped** square icons (172px), one-line description, `Case study →` → `/projects/<slug>`; three compact tiles (card tier: islamic-prayer-time, cycloidal-drive-creator, image-watermark-remover) with 72px icons → GitHub links. `All projects →` button → `/projects`. **Never center-crop the square card images into banner slivers.**
5. **CTA** — card `Have a role in mind?` / `Sunnyvale, CA · omar@hendaseh.com` / `Email me` + `LinkedIn`.
6. **Footer** — © Omar Younis · omar@hendaseh.com · Sunnyvale, CA.

**Cut from Home (deliberate):** Range/skills section (ticker owns that message; ME line lives in hero lede + About), scroll-scrub statement (mechanic rejected; the sentence moves to About), availability stamp, blueprint numbered section labels.

## Copy rules (added 2026-08-26)

- **No em dashes, no AI-cadence anywhere** (sitewide rule, originated in the projects contract). Plain sentences, numbers written naturally.
- **Copy-sync rule (clarified after B1 questions):** wherever Home shows a project, its **name AND description** are copied from the projects-page approved copy (`projects/v5.html` / APPROVED.md) — projects-page versions win on divergence (so: `Prayer-Time Algorithm Library`, `Image Watermark Remover`). Shortening only by truncation, which MAY drop a trailing sentence that duplicates adjacent meta text (e.g. the flagship description drops "Live on the App Store." because the meta line above says it). One project, one name, one description, everywhere.

## Section header pattern (sitewide)
Small blue eyebrow (12px, 900, letterspaced) + large statement heading (Roboto 900). No numbers, no rules-with-boxes.

## Hero copy (locked)
Lede (if used under tagline): "I design the solution first — then learn whatever the problem needs. Machines for seven years; now the software that drives them." — canonical-facts compliant; no embellishment beyond it.

## Apple-calibration rules (v11 — full-page audit, both themes)

**Light theme uses Apple's gray ladder on a near-white ground — never soft grays on a tinted ground:**
ground `#fbfbfd` (sky fades `#eef4fb → #fbfbfd`) · cards/surfaces `#fff` with hairline `#d2d2d7` + soft shadow `0 2px 12px rgba(0,0,0,.04)` · primary text `#1d1d1f` · muted text floor `#6e6e73` · tertiary/separators `#aeaeb2` · footer text `#86868b` over a hairline top border · secondary pill fill `#e3e3e8` on plain/white ground (one step darker than Apple default so it reads identical across white cards and the #fbfbfd page ground) — but **on tinted/sky surfaces the secondary pill is WHITE with an inset `#d2d2d7` hairline + soft shadow** (a gray pill melts into a tinted ground) · accent `#0071e3`.
Dark theme: footer text navy-300 with `#0d1e33` hairline (was too dim).

**AA override, light footer (approved 2026-08-26):** the implementation ships `#6e6e73` (4.9:1) for the light-theme footer text, not the `#86868b` (3.5:1) written above. Where Apple-fidelity and the WCAG AA floor conflict, the AA floor wins; `#6e6e73` is the same muted-text floor already named in this section.


- **Buttons are pills** (radius 980px), never outlined: primary = blue fill (#0071e3-family) + white text; secondary = soft fill (light: #e8edf4 + navy text; dark: rgba(199,214,230,.14) + white). Press response `:active { scale(.97) }` — feedback on pointer-down.
- **Text-contrast floor:** no UI text lighter than Apple's #6e6e73-equivalent on light (our #5d6f83 for ticker secondaries; nav links rgba(10,26,47,.8) weight 600). Same discipline in dark (ticker secondaries #6a87a5+).
- **Ticker loop:** two pixel-identical halves, `width:max-content`, `translate3d` keyframes, `will-change:transform` — fixes the wrap flash.
  - **As-built divergence, ruled 2026-08-27 after four failed designs on device — do NOT restore the line above.** The technique named here flickers at the loop boundary on iOS. `will-change:transform` in particular is now deliberately ABSENT, along with `backface-visibility:hidden`; re-adding either is a regression, not a fix.
  - What was tried, read as a 2x2 of (one animated element vs two) x (forced promotion vs none). All four flickered:
    1. One track at `-50%` with both promotion hints. Hypothesis was an oversized layer — forced promotion on a 2581 CSS px element is 7742 device px at DPR 3, past iOS's ~4096px GPU texture limit.
    2. Two halves each animated, hints kept. Every half was then 3870 device px, *inside* the limit, and it still flickered — which **falsified the texture-limit explanation** rather than confirming it.
    3. Two halves each animated, hints removed. Unchanged: the hints cost nothing and fixed nothing.
    4. One animated track again, no hints. Unchanged.
  - All four shared an invariant none of them varied: **the reset happened while the animated element was covering the viewport.** What ships instead is **phase-offset double buffering** — two identical tapes, each travelling `+100% → -100%`, the second at `animation-delay` of exactly half the period, so each tape's jump back happens while it is entirely off-screen. The discontinuity still exists; it is never on screen. Verified fixed on device (workerd preview, 390px).
  - Each tape repeats the six-item sequence enough times to be **≥3840 CSS px** wide. The pair's covered span narrows to one tape-width just before each reset, so a viewport wider than one tape gaps at the right edge — visible on 1440/1512/1728 Macs and wider displays, and this strip is full-bleed. Repeat count is derived from that target, not hardcoded. **Contract-neutral:** the ticker is a loop, so a viewer sees the same six items in the same order at any repeat count.
  - **Scroll speed is invariant and approved at ~43px/s.** Travel is twice the tape width, so duration is derived from the copy count (`60s` per copy) and the delay from the duration. Never hardcode a duration — that is how widening the tape silently changes an approved speed.
  - Only the *technique* diverges. Two pixel-identical tapes, `width:max-content`, `translate3d` keyframes and the ~30s-per-sequence cadence all still hold, and `tests/e2e/homepage.spec.ts` asserts every number above against the rendered result rather than trusting this file.


## Mobile rules (sub-880, added after phone review 2026-08-26)

- Hero cluster: horizontally centered; scale the whole cluster with `transform: scale()` on small viewports — never fixed-width geometry that can drift off-center.
- Flagship band: contents center-aligned, icon capped ~120px.
- Feature/work tiles: never stack into full-width sprawl — compact horizontal layout (icon ~84px left, text right), same as small tiles.
- Every future mockup ships an explicit phone-width pane; "implementer judgment" mobile layouts are no longer acceptable.

## Build notes for B1
- Both themes per the mockup pair; system `prefers-color-scheme` (flip mechanism stays Task B6).
- Framer Motion for pop-in/orbit or pure CSS — either, but reduced-motion = fully static (cluster frozen in the mockup's default pose, tape stopped).
- **Performance warning:** do NOT implement fine repeating-gradient rings/patterns in CSS (choked rasterizers in testing); SVG for any ring/guide geometry.
- Icons come from `public/images/projects/<id>/icon-squircle.png` + `public/images/nahtadi/icon.png` (green tile treatment for Nahtadi).
- Ticker duplicates its content once for the seamless -50% translateX loop.
- Mockup hex values map to the existing token scales (blue-400/500/600, navy-*); any value not in tokens becomes a token first.

## Accessibility divergence — ticker hover-pause and `aria-hidden` (2026-08-27)

> **Partly superseded.** The hover half of this section was overtaken the same day: hover-pause is now deleted rather than gated. Read "Ticker pause control" below for the current behaviour; this section is kept for the reasoning that led there.

The contract says the ticker "pauses on hover" and is `aria-hidden`. Both change, and the precedent is the one this program has already set twice (the light-footer AA override, and the About hero sky): **where mockup fidelity and an accessibility floor conflict, the floor wins.**

- **Hover-pause was gated to `@media (hover: hover) and (pointer: fine)`, and has since been REMOVED ENTIRELY** — see "Ticker pause control" below, which supersedes this bullet. Gating fixed the touch `:hover` trap (a tap applied `:hover`, froze the tape, and it only resumed when the user tapped elsewhere — Omar hit exactly that on the phone), but hover-pause as a mechanism was later deleted outright. Nothing pauses the tape now except the explicit control.
- **That leaves WCAG 2.2.2 (Pause, Stop, Hide, Level A) unmet on touch**, since the tape is scrolling content that starts automatically, never stops, and is presented alongside other content. It is met by a permanently visible pause control at one end of the strip. `aria-hidden` does not exempt the ticker: 2.2.2 is about visual distraction, not screen-reader exposure — which is why Apple ships a real labelled pause button on their own Fitness+ trainer marquee.
- **`aria-hidden` moves down onto the tape elements.** The tape stays decorative; the control must sit outside any `aria-hidden` subtree or it is invisible to assistive technology, which would defeat its purpose entirely.
- The control is a small monochrome pill, not a focal point, per this file's "quiet ticker" requirement — but it is permanently visible, because a control that requires hover cannot serve the touch users it exists for.

## Ticker item list and spacing divergence (2026-08-27)

This file locked six items and 30px of inline padding. Both change: **eight items, and 50px of inline padding**, taking one sequence from ~1290px to a measured **2064.64px**.

**The defect.** A viewport wider than one sequence shows the same item twice at once, once at each end. True since B1 and independent of everything the phase-offset work fixed — repeating the sequence cannot help, because it only adds more copies of the same items.

**Why not contain the strip.** Both contained treatments were actually built and shown: a hairline band in the page-wrap column, and Apple's Fitness+ answer, a rounded tile. Containing fixes duplicates completely at every size, because the column is capped at 1056px. It was **rejected**: it gives up the full-bleed seam without gaining a surface, and full-bleed is the only non-card rhythm on Home — every other element below the hero is a rounded bordered card.

**Why content plus modest spacing, rather than spacing alone.** Spacing alone would have to grow absurdly to clear a wide display, and this file locks the 30px padding precisely so it does not become a tuning knob. Content does most of the widening; air finishes it.

**The two new items** were confirmed interview-defensible by Omar, per the skills-defensibility rule in `.claude/CLAUDE.md`, and both are verbatim-grounded in the locked About copy:

- `1.5B LLM · ON A16` — from "Fine-tuned a 1.5B-parameter LLM and ran it entirely on an iPhone 14 Pro's A16 chip". **Framing is load-bearing:** this is an accomplishment with a number, never a competency label. CLAUDE.md holds that on-device ML is "a direction and interest ... never list it as a claimed competency", so it must not be restyled to `CORE ML` or `ON-DEVICE ML`.
- `AWS · 1M+ DATA POINT/MIN` — from "AWS ETL pipelines processing over one million data points per minute". The unit stays in words deliberately: the abbreviation-only form `1M+/MIN` was tested on Omar and he could not parse it, so naming the thing being counted is what makes the rate readable at ticker speed. The number itself is abbreviated.

The approved six keep their original relative order; the two additions are interleaved among the stats.

**Residual, and it is a real one.** At ~2065px the duplicate is cleared on every MacBook (1440/1512/1728) and on 1080p, but **not on a 2560px QHD display or wider** — closing 2560 would need roughly another 24% of sequence width. This is narrower than the original defect, not eliminated.

**Speed did not change and must not.** Widening the sequence would have silently sped the tape from 43.009px/s to 68.8px/s, because the old duration was a hardcoded 60s per copy and the copy count cancels out of `px/s = 2 × sequence ÷ secondsPerCopy`. Seconds-per-copy is now derived from the target speed and the measured sequence, so speed is a constant of the design and duration follows it. Measured after the change: **43.019px/s**. Guarded in `tests/e2e/homepage.spec.ts`.

## Ticker pause control (2026-08-27)

This file says the ticker "pauses on hover" and is `aria-hidden`. Both change, on the precedent this program has already applied twice (the light-footer AA override, the About hero sky): **where mockup fidelity and an accessibility floor conflict, the floor wins.**

**Why it exists.** The tape is scrolling content that starts automatically, never stops, and is presented alongside other content — WCAG 2.2.2 (Pause, Stop, Hide), Level A. Hover-pause is correctly gated to fine pointers, so on touch there was no mechanism at all. `aria-hidden` is not an exemption: 2.2.2 is about visual distraction, not screen-reader exposure. Apple ships the same control on their Fitness+ trainer marquee.

- **`aria-hidden` moves off the strip wrapper onto the two tape elements.** The tape stays decorative; a control inside an `aria-hidden` subtree is invisible to assistive technology no matter how well it is built, which would defeat its whole purpose. Guarded by a test that red-checks against putting it back.
- **A native checkbox with a styled label, no JavaScript.** Pause/play is a persistent two-state setting the user makes and that stays made, which is exactly what a checkbox is — so the control inherits native keyboard handling and native state announcement instead of reimplementing them in `aria-*`, and `HomeTicker` stays a server component with zero hydration.
- **Icon and accessible name flip together**, using `display: none` on the inactive pair — which removes a node from the accessible name computation as well as the page, so the name can never say "Pause" while the icon shows a play triangle. Both states are asserted.
- **Legibility over moving content** takes two parts. A `mask-image` fade on an inner viewport wrapper clears the tape before it reaches the control and softens the hard cut where a full-bleed strip meets the viewport edge; the wrapper exists because masking the strip itself would fade the background and the two hairlines, which must run edge to edge. The fade alone was **not enough to find the button**, so the control also carries its own filled circle, as Apple's does. Measured against the strip, the ring does most of the work (1.51:1 light, 1.86:1 dark) and the fill reads as presence rather than shape (1.22:1 light, 1.12:1 dark); the glyph clears the 3:1 non-text floor on it in both themes (4.15 light, 4.60 dark). The ground is `--ticker-control-bg`, composed from existing surface tokens and flipping direction between themes — it recesses on the white light strip (`--surface-sunken`) and lifts on the near-black dark one (`--surface-raised`), which is why one token could not serve both.
- **Hover-pause is DELETED, not gated — the contract's "pauses on hover" no longer describes the build.** It went through three positions before being removed, and the history is the argument for not reinstating it: ungated it was the touch `:hover` trap (a tap froze the tape until you tapped elsewhere); gated to fine pointers and scoped to the tape alone, the cursor's trip from tape to button left the hover region, so the tape resumed for the length of that trip and the click paused it further along; scoped to the whole strip, that jump went away but pressing play under the cursor no longer visibly resumed.

  The deciding argument is none of those: **the strip is full-bleed, so it spans the entire viewport, and any cursor travel down the page incidentally paused and resumed the tape.** Every one of those toggles is a chance to hit a real compositor artifact — pausing a composited animation forces the main thread to compute a position, and where its clock has drifted from the compositor's the tape jumps to the main thread's notion and jumps back on resume, which is exactly the intermittent forward-then-back movement reported. Removing hover does not fix that artifact; it removes the accidental, high-frequency trigger for it. **If the jump ever appears on a deliberate press of the control, that is worth reporting rather than working around.**

  The pause control is therefore the only pause mechanism, which is the point: one mechanism, explicit and discoverable, identical on every input type. A test asserts the tape is indifferent to the pointer, so a hover rule cannot creep back in unnoticed. The earlier guard that asserted the hover region contained the toggle is deleted with the rule — a guard for a mechanism that no longer exists is worse than none, the same reasoning that retired the `halfWidth * 3 <= 4096` assertion.
- **Hidden entirely under `prefers-reduced-motion`** — the tape is already static and parked there, so there is no motion to pause and no 2.2.2 obligation. The checkbox is hidden with it, so no invisible, purposeless control sits in the tab order.
- Pause and play are **self-drawn inline SVG**, never SF Symbols (licensing, per grammar v2). They live in `HomeTicker.tsx` rather than `LinkAffordance.tsx`: that file holds the five link-affordance glyphs as a locked, geometry-guarded family, and a transport control is not one of them. They are filled rather than stroked, as Apple draws transport controls, sized so the filled mass reads at the weight of the stroked family beside it.
- Quiet per this file's requirement: monochrome, one end of the strip, 44px of hit target held 20px clear of the right edge (iOS reserves roughly the outer 20px for its back-swipe gesture). Permanently visible — a control that required hover could not serve the touch users it exists for.
