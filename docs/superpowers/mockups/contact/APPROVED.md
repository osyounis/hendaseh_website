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

## Link-affordance grammar (SITEWIDE LAW, formalized here)

- `→` = internal navigation · `↗` = external link (new tab) · `↓` = download.
- Destination icons (octocat, ) say WHERE; arrows say WHAT HAPPENS; they compose ("GitHub ↗" with octocat icon).
- Every interactive card and pill has the standard `:active` press response (scale .96–.98).
- Arrows are VISUAL ONLY: always `aria-hidden`; the link text/label must be self-sufficient for screen readers. (Applies retroactively to the older → arrows.)
- A scroll-to-anchor gets NO arrow (neither → nor ↓ applies).
- Applies to ALL pages. B2/B3/B4 build to it; where already-built Home misses it (GitHub pills without ↗, résumé links without ↓, cards without :active), the next B-task touching that surface retrofits it.

## Build notes for B4

- Clipboard Playwright test with permissions granted; assert button label/state morph and revert.
- Links: LinkedIn `https://www.linkedin.com/in/omar-younis/`, GitHub `https://github.com/osyounis`, résumé `/omar_younis_resume_2026.pdf` (or its post-audit replacement path) — `target="_blank" rel="noopener"` on the externals.
- No em dashes, no AI cadence; metadata untouched (B5 owns it).
- Both themes; Apple gray ladder rules apply.
