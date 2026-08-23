# Hendaseh.com Redesign Roadmap

The master plan for the full redesign of hendaseh.com. Every design and implementation decision should be made with this document in mind. Program-level **locked decisions** (site structure, stack, hosting, tier system, brand direction) live in the foundation-reset spec: [`docs/superpowers/specs/2026-08-23-foundation-reset-design.md`](superpowers/specs/2026-08-23-foundation-reset-design.md) — that section is authoritative if anything conflicts.

**Vision:** a UI/UX-forward portfolio — Apple/Tesla-caliber polish on the Hendaseh brand (hexagonal mark, blue `#0093FF`, navy `#0A1A2F`, Roboto) — that positions Omar as an iOS engineer with on-device-ML depth and a shipped App Store product, without a single boring page.

**Structure:** four public pages (Home, About, Projects, Contact) + the Nahtadi family (`/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support` — URLs frozen, App Store links to them) + `/projects/[slug]` showcase pages for projects that earn one.

## Status

| # | Sub-project | Status |
|---|-------------|--------|
| 1 | Foundation reset | **In progress** — spec approved 2026-08-23 |
| 2 | Hosting migration | Not started |
| 3 | Asset engine | Not started |
| 4 | Page redesigns | Not started |
| 5 | Case-study content | Not started |

Each sub-project gets its own design → spec → implementation-plan cycle when it starts. Statuses here get updated as phases complete.

## 1 — Foundation reset

**Goal:** make the ground solid so the redesign moves fast and nothing contradicts anything.

- Design token system from the brandbook (Tailwind v4 `@theme`): color scales, semantic tokens for dark + light themes (dark-first), Roboto via `next/font`, type/spacing/motion scales; internal `/dev/tokens` preview page.
- Content audit: reconcile github.com/osyounis against `projects.json` (add Radar Moboard etc.), produce `docs/CONTENT-AUDIT.md` + canonical-facts sheet from Omar's answers, current résumé, and his saved section text (`docs/content/`).
- `projects.json` schema v2: `tier` (flagship/showcase/card), `brand` fields for the asset engine, consolidated `links`, Zod validation in tests.
- Repo hygiene: delete `/capabilities` (301 → `/about`), re-enable ESLint, rewrite CLAUDE.md fresh, refresh README, create `docs/DECISIONS.md`.

**Exit:** build/tests/lint green, tokens render in both themes, schema migrated with no visual change, docs rewritten.

## 2 — Hosting migration (Vercel → Cloudflare Workers)

**Goal:** the current, known-good site running on the platform everything after is built for.

- `@opennextjs/cloudflare` adapter + `wrangler` config; ImageKit (or Cloudflare Images) as the `next/image` loader replacing Vercel's optimizer.
- Swap `@vercel/analytics` / Speed Insights for a Cloudflare-friendly equivalent at cutover.
- Verify every route on a `workers.dev` preview — especially `/nahtadi/*`, the contact form (Resend), OG image generation, redirects, sitemap.
- Move DNS from GoDaddy→Vercel to Cloudflare; keep Vercel live until Cloudflare is verified; then cut over. CI: deploy on push to `main`, previews for branches.

**Exit:** hendaseh.com serves from Cloudflare Workers with all routes verified, Nahtadi URLs intact, Vercel decommissioned.

**Needs from Omar:** Cloudflare account + one-time `wrangler login`; GoDaddy DNS access.

## 3 — Asset engine

**Goal:** one command per project produces its full, brand-consistent asset set — reusable on the website *and* copied into GitHub repos.

- Hybrid pipeline: code-rendered brand frame (gradient background, layout, typography — deterministic, free to re-render) + optional AI-generated artwork layer for the icon mark (Higgsfield API — access to be verified; needed mainly for projects with nothing to screenshot).
- Outputs per project, driven by `projects.json` `brand` fields: app-style icon (1024²), site banner, GitHub social-preview banner (1280×640).
- ImageKit for storage/transformation of generated assets (API MCP already connected).
- Regenerate the full existing catalog so every project card matches.

**Exit:** all projects have matching icon + banners generated from the pipeline; adding a project = add JSON entry, run one command.

## 4 — Page redesigns

**Goal:** the UI/UX-forward site — every page designed, not templated.

- Home: full above the fold, real hierarchy, Nahtadi as flagship story.
- Projects: searchable/filterable grid built around the new assets; `/projects/[slug]` case-study template.
- About: Omar's arc (ME → ML → iOS) told with intent, from the canonical facts + his source text.
- Contact: simple, polished, Resend-backed.
- Nahtadi pages: visual consistency pass, URLs and SEO untouched.
- Both themes, `prefers-reduced-motion`, WCAG-conscious contrast, no SEO regressions (metadata, JSON-LD, sitemap preserved).

**Exit:** all pages shipped in both themes, Lighthouse/axe clean, SEO parity confirmed.

## 5 — Case-study content

**Goal:** depth where there's a story — especially the private Coast Guard work.

- Write and build showcase pages for the chosen tier-2 projects (from the audit): Radar Moboard, pilot training tracker, helicopter inventory, brent-cuda, prayer-time library, collision-avoidance (live embed).
- Sanitized visuals for private projects: screenshots/GIFs of shareable animations (Omar captures; pipeline/ImageKit processes), diagrams where screenshots can't be shown.
- Final tier assignment for every project; card-only projects link to GitHub.

**Exit:** every repo/project accounted for at its right tier; private projects presentable without revealing anything sensitive.

## Standing notes

- **Backend:** none. If one is ever needed, **Supabase** is the designated choice (see `docs/DECISIONS.md` once created).
- **Connected tooling:** GitHub MCP, ImageKit API + DevTools MCP (authenticated 2026-08-23). Higgsfield: direct API, unverified. Vercel MCP until decommissioned.
- **Résumé + section text:** Omar supplies during the Phase 1 content audit (`docs/content/`); the résumé in `public/` is outdated until then. Everything in `docs/content/` is **raw material only** — possibly outdated or rough by Omar's own assessment; final copy is workshopped with him during phases 4–5, never published verbatim.
