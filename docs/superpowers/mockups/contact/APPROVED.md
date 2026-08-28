# Contact — APPROVED design contract (M4, 2026-08-27)

**Approved mockups (visual contract for Task B4):**
- `v2.html` — dark (canonical) · `v2-light.html` — light companion

## The page

One idea: **the email address is the hero.** No form (decided phase 2), no availability stamp (sitewide decision).

- Header: eyebrow `CONTACT`, heading `Say hello.` (period, never an exclamation mark — Apple copy confidence), sub: "Email is the fastest way to reach me. Everything below works too."
- **Email hero:** `omar@hendaseh.com` at display size, `@` in accent blue. Beside it the **Copy button** (primary pill): on tap, writes the address to the clipboard and morphs — icon → check, label blur-swaps to `Copied`, pill turns green (light: `#248a3d`), reverts after 2s. Real `navigator.clipboard` with graceful no-op on failure. `aria-label="Copy email address"`. Hint below: "One tap and it's in your clipboard." — this hint refers ONLY to the Copy button.
- **Channel cards** (3): `LinkedIn ↗` (omar-younis, opens profile in new tab), `GitHub ↗` (osyounis, new tab), `Résumé ↓` (downloads, `download="Omar_Younis_Resume.pdf"` per sitewide rule). Cards are LINKS, never copy actions; the ↗/↓ affordance marks reuse the projects-page grammar. Shared `.home-tile` hover + focus-visible, plus `:active scale(.98)` press feedback.
- Sign-off line: `SUNNYVALE, CA · I READ EVERYTHING`. Footer standard.
- Entrance: staggered rise cascade (eyebrow → heading → sub → email → hint → cards → sign-off, ~120ms steps, 600ms ease-out). Aurora background at reduced opacity. Reduced motion: fully static.
- Mobile (sub-880): channel cards become full-width rows (icon left, labels left-aligned), email wraps, everything centered otherwise.

## Link-affordance grammar v2 (SITEWIDE LAW — Apple symbol semantics, adopted 2026-08-27)

Chevrons = movement within the experience; arrows = actions or leaving it (Apple's own vocabulary, per Omar's audit of apple.com):

- **chevron-right** `›` = internal navigation (replaces the older `→` on "Case study", "The story", "All projects", etc. — label text unchanged, glyph swapped)
- **chevron-down-in-circle** = in-page jump/anchor ("Launch live demo" carries this — supersedes the earlier no-arrow ruling)
- **arrow-down-in-circle** = download (replaces bare `↓`)
- **arrow-up-right** = external link, new tab (unchanged)
- **chevron-left** = back / return, the mirror of chevron-right and Apple's own back affordance (added 2026-08-27; replaces the Unicode `←` on the case-study breadcrumbs and `/nahtadi/support`'s back link — label text unchanged, glyph swapped). It is the one LEADING glyph: it precedes its label, so it welds to the label's FIRST word.

**Licensing: never use SF Symbols assets or fonts on the web** (Apple's license restricts them to Apple-platform software). All five glyphs are SELF-DRAWN SVGs matching these semantics.
- Destination icons (octocat, ) say WHERE; arrows say WHAT HAPPENS; they compose ("GitHub ↗" with octocat icon).
- Every interactive card and pill has the standard `:active` press response (scale .96–.98).
- Arrows are VISUAL ONLY: always `aria-hidden`; the link text/label must be self-sufficient for screen readers. (Applies retroactively to the older → arrows.)
- **Arrows are inline SVG, never Unicode characters** (iOS renders U+2197 as an emoji; fonts render it at wild lengths; text arrows orphan-wrap). Every glyph is baseline-aligned and welded to an adjacent word in a `white-space: nowrap` span so it can never wrap onto its own line — to the label's LAST word for the four trailing glyphs, to its FIRST word for the leading chevron-left.
- **Size is PER GLYPH, not one shared value** (MEASURED 2026-08-27 off Omar's apple.com references; supersedes the earlier uniform ~0.65em and the eyeballed 0.62 / 0.78 / 1.00em box estimates). Each figure below is **ink** — the visible drawn extent — read as a ratio of the capital-letter height in the same screenshot and converted through Roboto's cap height (0.711em), not a box size and not an estimate. Apple sizes these by role, and a circle-enclosed mark at chevron height reads as undersized because its interior arrow collapses:
  - chevron-left / chevron-right — **0.533em of ink** (75% of cap; 0.714em box), small and light
  - arrow-up-right — **0.599em of ink** (83% of cap; 0.78em box), a clear step up
  - chevron-down-in-circle / arrow-down-in-circle — **1.009em of ink** (142% of cap; 1.19em box), cap-height-plus, reads as a control
  - **Box heights are derived, never chosen.** The anti-clip invariant below costs one stroke-width of padding per side, so ink is a fixed fraction of the box and more ink means a bigger box — ink is never bought back by shrinking the clearance.
  - **One stroke weight across the family: ~0.090em at every size.** That is how a symbol family works; scaling the strokes up with the boxes would make the chevron, the smallest mark, the heaviest thing on the line.
- **Gap to the label is ~0.35em** for the chevrons and the diagonal arrow, **~0.38em** for the heavier circle-enclosed pair (both measured off the same references). Set in `em` so it tracks the label.
- **Anti-clip invariant:** every glyph's ink — its drawn coordinate plus half a stroke-width, because round caps and joins are discs of radius sw/2 — must clear its viewBox edge by at least ONE FULL stroke-width. SVG's default `overflow: hidden` clips anything past the edge. This is arithmetic, guarded by `tests/e2e/link-affordance.spec.ts`, not a visual check.
- (Superseded by grammar v2: scroll-to-anchor uses chevron-down-in-circle.)
- Applies to ALL pages. B2/B3/B4 build to it; where already-built Home misses it (GitHub pills without ↗, résumé links without ↓, cards without :active), the next B-task touching that surface retrofits it.

## Build notes for B4

- Clipboard Playwright test with permissions granted; assert button label/state morph and revert.
- Links: LinkedIn `https://www.linkedin.com/in/omar-younis/`, GitHub `https://github.com/osyounis`, résumé `/omar_younis_resume_2026.pdf` (or its post-audit replacement path) — `target="_blank" rel="noopener"` on the externals.
- No em dashes, no AI cadence; metadata untouched (B5 owns it).
- Both themes; Apple gray ladder rules apply.
