# Foundation Reset — Design Spec

**Date:** 2026-08-23
**Sub-project:** 1 of 5 (Hendaseh website redesign program)
**Status:** Awaiting review

## Program context

hendaseh.com is being redesigned end-to-end with a fresh, UI/UX-forward philosophy. The program is five sub-projects, executed in this order (approved 2026-08-23):

1. **Foundation reset** (this spec) — design tokens, content audit, data schema, repo hygiene.
2. **Hosting migration** — Vercel → Cloudflare Workers via `@opennextjs/cloudflare`; GoDaddy DNS → Cloudflare; cut over once verified.
3. **Asset engine** — hybrid pipeline: code-rendered brand frame (gradient, layout, typography) + optional AI-generated artwork layer. Per project, one command produces an app-style icon (1024²), a site banner, and a GitHub social-preview banner (1280×640) that match across web and GitHub.
4. **Page redesigns** — Home, Projects (+ `/projects/[slug]` case-study template), About, Contact; consistency pass on Nahtadi pages.
5. **Case-study content** — private-project showcases (Radar Moboard, Coast Guard tools) with sanitized screenshots/GIFs; final tier assignment for every project.

### Program-level decisions (locked)

- **Site structure**: exactly four public pages — Home, About, Projects, Contact — plus the Nahtadi family and per-project showcase pages. `/capabilities` is deleted.
- **Frozen URLs**: `/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support` must never change — the App Store links to them.
- **Stack**: keep Next.js (App Router) + Tailwind v4. Streamlining is a cleanup inside the stack, not a framework change.
- **Hosting**: Cloudflare Workers (not Cloudflare Pages — Pages is in maintenance mode; Workers is Cloudflare's recommended target, and `@opennextjs/cloudflare` is the Next.js-team-recommended adapter).
- **Detail pages are tiered**: `flagship` (Nahtadi, custom page) / `showcase` (`/projects/[slug]` case study — only projects with a real story and visuals) / `card` (card links out to GitHub, no page). Every project regardless of tier gets the full asset treatment so the projects grid reads uniform.
- **Backend**: none for now. **Supabase is the designated backend if one is ever needed** (record in `docs/DECISIONS.md`).
- **Images**: ImageKit serves as the `next/image` loader replacement on Cloudflare (Vercel's optimizer goes away) and as storage/transformation for generated assets. Higgsfield generates icon artwork where a project has nothing to screenshot (verify API access during sub-project 3).
- **Brand**: the brandbook (`docs/brand/Hendaseh-brand-updated.pdf`) is the identity anchor — hexagonal interlocking-H mark, blue `#0093FF`, navy `#0A1A2F`, Roboto Medium/Regular, clear-space rules. The *website design* builds on these tokens expressively (navy-grounded dark theme, gradient depth, large type, restrained motion) rather than copying the brandbook's flat corporate look. Not boring is a requirement.

## Scope of this sub-project

Four workstreams. No visual redesign happens here — this makes the ground solid so the redesign moves fast.

### 1. Design token system

Translate the brandbook into web design tokens in Tailwind v4 (`@theme` in `globals.css`):

- **Color**: brand blue and navy expanded into full usable scales; semantic tokens (`surface`, `surface-raised`, `text-primary`, `text-secondary`, `accent`, `border`, etc.) with values for **both dark and light themes, designed together, dark-first**. Theme switching via `class` strategy honoring `prefers-color-scheme`, with a manual toggle possible later.
- **Typography**: Roboto (Medium for headings, Regular for body) via `next/font` with a real fallback stack; a named type scale (display / h1 / h2 / h3 / body / small).
- **Spacing, radius, elevation, motion**: named tokens; motion respects `prefers-reduced-motion`.
- **Deliverable**: tokens live in `globals.css`; an internal, `noindex`, unlinked `/dev/tokens` page renders every token in both themes for visual verification (removed or gated before the program ends).

### 2. Content audit

- Enumerate all repos on github.com/osyounis and reconcile against `src/data/projects.json`: missing projects (Radar Moboard and any others), stale entries, wrong facts.
- Produce `docs/CONTENT-AUDIT.md`: every project with its proposed tier, plus a **canonical-facts sheet** (display location, contact email, résumé file currency, employer titles, App Store data) with open questions batched for Omar to answer once.
- The audit is the input to tier assignments and case-study work; final tier decisions happen there, not here.

### 3. `projects.json` schema v2

Restructure each project entry to serve the redesign and the asset engine:

- `id`, `title`, `tagline` (short display line), `description`
- `tier`: `"flagship" | "showcase" | "card"`
- `technologies`, `keywords` (drives project search/filter)
- `links`: `{ github?, live?, embed?, appStore?, custom? }` (nullable-field sprawl collapsed)
- `brand`: `{ gradient: [from, to], iconArt? }` — per-project inputs the asset engine consumes
- `stats` / impact numbers; `private: boolean` for Coast Guard-style projects
- A **Zod schema** validates `projects.json` in the existing Vitest suite; `src/lib/projects.ts` helpers updated; all current consumers migrated.

### 4. Repo hygiene

- Delete the `/capabilities` route and its orphaned components; add a permanent redirect `/capabilities` → `/about` in `next.config.ts` (carried over to Cloudflare during migration).
- Re-enable ESLint (the `lint` script is currently a disabled placeholder pending flat-config migration) and make `npm run test:all` honest again.
- **Rewrite CLAUDE.md from scratch**: fresh philosophy (UI/UX-forward, brand-token-driven, four-page structure, tier system, frozen Nahtadi URLs, canonical facts) replacing the accreted old instructions. Old reference content is dropped, not carried forward.
- Refresh `README.md`; create `docs/DECISIONS.md` recording the program-level decisions above (including Supabase-as-future-backend and Cloudflare Workers as host).
- Remove dead code/config found along the way (e.g., unused components, stale configs) — discovered during implementation, listed in the plan.

## Out of scope

- Any visual redesign of pages (sub-project 4)
- Asset generation (sub-project 3)
- Hosting migration (sub-project 2)
- Case-study writing (sub-project 5)
- Removing `@vercel/analytics` / Speed Insights (migration concern)

## Success criteria

- `npm run build`, `npm run test:run`, and a re-enabled `npm run lint` all pass.
- `/dev/tokens` renders the full token set correctly in both themes.
- `projects.json` validates against the Zod schema; site renders identically (no visual change intended in this sub-project).
- `/capabilities` returns a 301 to `/about`; all other routes unchanged.
- CLAUDE.md, README, `docs/DECISIONS.md`, `docs/CONTENT-AUDIT.md` rewritten/created.

## Error handling & risks

- **Schema migration breaking pages**: every consumer of `projects.json` is found via type errors (TypeScript) and the test suite; migration is done in one commit with tests green.
- **Redirect regressions**: Playwright test asserts the `/capabilities` redirect and spot-checks key routes.
- **Canonical-fact unknowns**: unresolved facts (location, email, titles) are flagged in the audit doc and left as-is on the site until Omar confirms — no guessed facts get published.
