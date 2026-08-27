# Page Redesigns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Execution split:** MOCKUP tasks (M-tasks) run interactively — Fable + Omar, design skills loaded (`frontend-design`, `ui-ux-pro-max`, **`apple-design` + `emil-design-eng`** — standing rule from M1: every mockup is checked against the Apple-calibration ruleset in docs/superpowers/mockups/home/APPROVED.md, both themes, before it goes to Omar), Mobbin for references. BUILD tasks (B-tasks) run in CLI sessions from the approved mockup files. **No B-task starts before its M-task's approval is recorded.** Approved mockups are committed under `docs/superpowers/mockups/<page>/` and are the build's visual contract, together with the spec.

**Goal:** All five page surfaces redesigned per the spec, in both themes, with the new tagline converged and metadata cleaned.

**Architecture:** Pages adopt the token system fully (semantic tokens only — no raw grays/hex in new markup; new spacing/elevation tokens added as mockups define them). Dark stays behind the existing `data-theme` variant until the final task, then flips to `prefers-color-scheme` sitewide in one commit (avoids a mixed dark-nav/white-page state in production mid-phase).

**Tech Stack:** Existing only — Next.js 16, Tailwind v4 tokens, Framer Motion, Vitest/Playwright. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-08-25-page-redesigns-design.md` (its "Decisions locked" and per-page scope sections are binding).

## Global Constraints

- New surface string everywhere a tagline appears: `Software Engineer · iOS, ML & Autonomous Systems`
- Titles keep their page prefix and `| Hendaseh` suffix; only the tagline segment changes. Meta descriptions ≤160 chars.
- Frozen URLs `/nahtadi*`; no route changes; static-only (no ISR/actions/API routes).
- New markup consumes semantic tokens only. Any needed value missing from the scale becomes a token first (`globals.css` + `/dev/tokens`), never an inline magic value.
- AA contrast both themes; semantic HTML; keyboard/focus; `prefers-reduced-motion` fallback for every animation (the `useSyncExternalStore` reduced-motion hook + its hydration e2e guard stay green).
- Per task: `npm run build && npm run test:run && npm run lint` green; e2e for touched routes; commits on `dev` ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Copy: drafted from `docs/content/` + CLAUDE.md canonical facts, approved by Omar in the M-task, never invented facts.

---

### Task M1: Home mockups — ⏸ Fable + Omar

**Files:** Create `docs/superpowers/mockups/home/` (direction files + `APPROVED.md` recording the chosen direction and Omar's adjustments)

- [x] Invoke `frontend-design` + `ui-ux-pro-max`; pull Mobbin references for hero/portfolio patterns.
- [ ] Produce 2–3 full-page Home directions at realistic scale (real copy drafts, real phase-3 assets, real nav/footer), presented for click-through. Dark theme first; winner also shown light.
- [ ] Directions must differ meaningfully (layout system, gradient treatment, type scale attitude) — not palette swaps. Each embodies "cinematic entrance, quiet interior" differently.
- [ ] Iterate with Omar; record approval + change list in `APPROVED.md`; commit mockups.

### Task B1: Build Home + global nav/footer

**Files:** `src/app/page.tsx`, `src/components/home/*` (rewrite), `src/components/navigation/Navigation.tsx`, new `src/components/Footer.tsx` (extract from layout), `src/app/globals.css` (new tokens from mockup), `src/app/layout.tsx` (footer swap only — theme flip is Task B6)

- [ ] Implement the approved mockup exactly; deviations require Omar (screenshot diff vs mockup in PR).
- [ ] Hero set-piece: Framer Motion orchestration; static-perfect under reduced motion (assert via the existing hydration spec pattern on `/`).
- [ ] Playwright: nav (mobile + desktop), hero renders, featured cards link per tier (`getProjectHref`).
- [ ] Tagline string lands in `HomeHero`; do NOT touch metadata yet (B5 owns convergence).
- [ ] Omar approves in browser (⏸) → commit.

### Task M2 / B2: Projects page + case-study template

- [ ] M2 (⏸): mockups for grid (search/filter UX preserved), tier-aware cards on engine assets, and the case-study template (banner slot, problem→approach→impact, media + embed slots, stats row) shown populated with brent-cuda AND collision-avoidance content. Approval recorded as M1.
- [ ] B2: implement grid + template; migrate the two showcase pages; Playwright: filter/search flows, `/projects/reddit-nlp` still 404s, embed loads; visual approval (⏸) → commit.

### Task M3 / B3: About

- [ ] M3 (⏸): copy workshop FIRST (the arc mechanical → software → autonomy from `docs/content/` + canonical facts; Coast Guard dual-role rules; defensible skills list only) — then mockup with approved copy in place.
- [ ] B3: implement; résumé link `download` attr identical to all others; Playwright: download attr, heading order; approval (⏸) → commit.

### Task M4 / B4: Contact

- [ ] M4 (⏸): mockup — email + copy-to-clipboard, LinkedIn, GitHub, résumé, location/availability.
- [ ] B4: implement; Playwright: clipboard copy (grant permissions in test), links; approval (⏸) → commit.

### Task B5: Metadata convergence + OG regeneration (no mockup needed)

**Files:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/projects/page.tsx`, `src/lib/ogCards.ts`, `src/components/StructuredData.tsx`, `public/og/*`

- [ ] Every `metadata` title/OG/twitter tagline segment → new string (keep prefixes/suffix); all descriptions rewritten ≤160 chars (drafts pre-written, Omar skims once ⏸); JSON-LD `jobTitle`/description aligned.
- [ ] `ogCards.ts` site-card tagline → new string; `npm run generate:og`; commit regenerated PNGs (per the standing OG-staleness rule).
- [ ] e2e: og.spec still green; grep: zero occurrences of `iOS & Machine Learning` / `iOS & ML` remain in `src/`.

### Task B6: Theme flip + Nahtadi pass + closeout

**Files:** `src/app/globals.css`, `src/app/nahtadi/*` (class-level consistency only), `src/app/dev/tokens/*`, `.claude/CLAUDE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`

- [ ] Nahtadi pages: adopt new nav/footer + tokens; zero content/metadata/JSON-LD changes; `/nahtadi` e2e + reduced-motion guard green.
- [ ] Flip dark to system: `@custom-variant dark` → media-based (`prefers-color-scheme`), remove `data-theme` plumbing, verify every page in both OS modes (Playwright `colorScheme` projects for key routes).
- [ ] Resolve light-theme contrast caveat (darken tokens or restrict usage — record choice in DECISIONS.md); axe + Lighthouse pass on all six key routes (Perf ≥90 / A11y ≥95 / SEO 100 mobile).
- [ ] Gate `/dev/tokens` (noindex stays; link nowhere; keep — it's harmless and useful) or remove if Omar prefers (⏸ one question).
- [ ] CLAUDE.md: positioning table replaced (all rows converged on new string), theme section updated, phase marked complete in ROADMAP; DECISIONS.md entries: tagline supersession, system-theme flip, contrast resolution.
- [ ] Final: full suite + `BASE_URL=https://hendaseh.com npm run test:e2e` after deploy; PR dev → main (⏸ Omar merges).
