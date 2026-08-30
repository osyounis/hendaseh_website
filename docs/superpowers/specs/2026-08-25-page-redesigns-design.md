# Page Redesigns — Design Spec

**Date:** 2026-08-25
**Sub-project:** 4 of 5 (see `docs/ROADMAP.md`; program decisions in `docs/DECISIONS.md`)
**Status:** Awaiting review

## Goal

The UI/UX-forward site this program exists for: Home, Projects (+ case-study template), About, and Contact designed — not templated — on the phase-1 tokens and phase-3 assets, plus a consistency pass on the Nahtadi pages. Every page ships in both themes with the new positioning string.

## Decisions locked in this design (2026-08-25, with Omar)

1. **New surface string — supersedes the old locked tagline:**

   > `Software Engineer · iOS, ML & Autonomous Systems`

   Rationale: Omar is targeting AI/ML and autonomous-vehicle roles. "ML" over "AI" (precision reads stronger to technical screeners and never filters him out of AI roles; his evidence is ML-shaped). "Autonomous Systems" over "Automated Vehicles" (umbrella term, defensible as direction). This string converges across hero, OG cards, `metadata` titles, and JSON-LD during this phase; CLAUDE.md's positioning section is updated accordingly. **Positioning shift that comes with it:** for AV/robotics readers, the 7-year ME background is elevated from bridge to differentiator — the About arc becomes *mechanical → software → autonomy*. Caveat, accepted: "Autonomous Systems" is a promissory note until sub-project 5 ships Radar Moboard + reframed collision-avoidance/CUDA content.

2. **Theme: dark + light, following `prefers-color-scheme`. No toggle.** This phase flips pages onto the semantic tokens and switches dark mode from the opt-in `data-theme` mechanism to system-driven (the reconsideration CLAUDE.md deferred to this phase). Both themes are designed, dark-first.

3. **Review flow: mockups first.** No page is built before Omar approves its visual design. Home gets 2–3 distinct directions at realistic scale (full page, real content, both themes for the winner); other pages get one direction derived from Home's approved language, refined per Omar's feedback. Rejection happens at the mockup, not after a build. (Phase-3 lesson: approvals only count at realistic scale and in context.)

4. **Hero: Omar + tagline.** Name, the locked string, one line of problem-solver framing (workshopped copy), primary CTAs (projects, résumé, contact) — with Nahtadi as the first proof directly below (App Store live + 5.0 rating).

5. **Motion: "cinematic entrance, quiet interior."** One set-piece moment on the Home hero — living navy/blue gradient surface, orchestrated type reveal — then restrained, purposeful motion elsewhere (hover depth, scroll reveals that are felt, not watched). Full `prefers-reduced-motion` fallback: the site is completely presentable static. Framer Motion only — no WebGL/three.js or other heavy additions. Mobbin available for reference pulls during mockups.

6. **Page order:** Home (sets the language) → Projects → About → Contact → Nahtadi pass. Each page: mockup → Omar approves → build (TDD where testable) → Omar approves in browser → next.

## Scope per page (requirements, not visual design — that happens in mockups)

- **Home:** hero as above; flagship Nahtadi section; featured projects (phase-3 card assets); a range/skills strip governed by the skills-defensibility rule; footer. Old `HomeCapabilities`/`HomeCTA` content absorbed or dropped, not carried by default.
- **Projects:** searchable/filterable grid rebuilt around the uniform engine assets (search/filter behavior preserved from today's implementation); tier-aware cards (showcase → case-study page; card → GitHub link; flagship → `/nahtadi`). **Case-study template** (`/projects/[slug]`) redesigned for today's two showcase projects AND phase 5's needs: banner/hero slot, problem → approach → impact structure, media slots (images, GIFs, live embeds), stats row, tech list, GitHub/live links.
- **About:** the mechanical → software → autonomy arc told with intent; canonical facts only (CLAUDE.md "Canonical facts" section is the source); Coast Guard dual-role presentation per its rules (lead Software Engineer role, never imply paid employment); skills list interview-defensible only; résumé download (`download="Omar_Younis_Resume.pdf"` kept identical everywhere).
- **Contact:** direct channels done beautifully — email with copy-to-clipboard, LinkedIn, GitHub, résumé, location (Sunnyvale, CA) + availability line. No form (decided phase 2).
- **Nahtadi pages:** adopt the new nav/footer/tokens for consistency; URLs, content, structured data, and SEO untouched otherwise.
- **Global:** navigation + footer redesigned (both themes, mobile-first); **spacing and elevation token scales built here** (the known phase-1 gap — driven by the layouts, added to `globals.css` and `/dev/tokens`); light-theme contrast caveat resolved (darken `accent`/`fg-muted` or keep them off raised surfaces — final call during build, AA required); metadata titles converge on the new string; **meta descriptions shortened to ≤160 chars** (repo-recorded issue: currently ~2× too long); OG cards regenerated with the new tagline (`npm run generate:og`); `/dev/tokens` gated or removed at phase end per its standing note.

## Copy process

All page copy is workshopped with Omar section-by-section from `docs/content/` raw material + canonical facts — drafted by Claude, approved by Omar, never lifted verbatim from the raw files. Positioning rules govern: problem-solver framing in prose, never in short slots; no full-stack/frontend positioning; nothing the canonical-facts sheet doesn't contain.

## Constraints

- SEO: preserve metadata exports, JSON-LD, canonicals, sitemap; the only intended changes are the tagline segment, shortened descriptions, and whatever new sections mockups add. `/nahtadi` SEO must not regress. No route changes at all in this phase.
- Hosting: static-only remains true — no ISR, revalidation, server actions, or API routes (the `staticAssetsIncrementalCache` constraint from phase 2 stands until a KV cache exists).
- Accessibility: semantic HTML, correct heading order, keyboard nav, visible focus, AA contrast in both themes, `prefers-reduced-motion`.
- Performance: no new heavy dependencies; Lighthouse (mobile) targets on every page — Performance ≥ 90, Accessibility ≥ 95, SEO = 100.
- Skills routing (CLAUDE.md MUST): `frontend-design` + `ui-ux-pro-max` before any markup; `dataviz` if any chart appears; superpowers process skills throughout.

## Success criteria

- All five page surfaces shipped in both themes; every mockup and every built page carries a recorded Omar approval.
- New tagline live across hero, OG cards (regenerated), titles, JSON-LD; meta descriptions ≤160 chars; CLAUDE.md positioning table updated to the new string with all rows converged.
- Build, unit, e2e, lint green; Playwright suite extended for new interactive elements (search/filter, copy-email, reduced-motion hydration guard stays green).
- Lighthouse/axe targets met on `/`, `/projects`, one case study, `/about`, `/contact`, `/nahtadi`.
- Spacing + elevation scales exist as tokens and are used by the new pages (no ad-hoc magic values).

## Out of scope

- Case-study *content* (Radar Moboard, CG tools writing/visuals) — phase 5. The template ships with today's two showcase projects.
- New projects/tiers in `projects.json` (phase 5), backend anything, analytics changes.

## Risks

- **Taste risk** (phase-3 lesson): mitigated by mockups-first, realistic scale, directions anchored in Omar's approved work (assets, Nahtadi, brand PDF), color varied per element, rich-over-sterile bias.
- **Scope creep per page:** one page at a time behind approval gates; anything new discovered mid-page gets queued, not absorbed.
- **Copy bottleneck:** copy workshops batched per page with concrete drafts to react to, not blank-page questions.
