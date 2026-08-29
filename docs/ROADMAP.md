# Hendaseh.com Redesign Roadmap

The master plan for the full redesign of hendaseh.com. Every design and implementation decision should be made with this document in mind. Program-level **locked decisions** (site structure, stack, hosting, tier system, brand direction) live in the foundation-reset spec: [`docs/superpowers/specs/2026-08-23-foundation-reset-design.md`](superpowers/specs/2026-08-23-foundation-reset-design.md) — that section is authoritative if anything conflicts.

**Vision:** a UI/UX-forward portfolio — Apple/Tesla-caliber polish on the Hendaseh brand (hexagonal mark, blue `#0093FF`, navy `#0A1A2F`, Roboto) — that positions Omar as an iOS engineer with on-device-ML depth and a shipped App Store product, without a single boring page.

**Structure:** four public pages (Home, About, Projects, Contact) + the Nahtadi family (`/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support` — URLs frozen, App Store links to them) + `/projects/[slug]` showcase pages for projects that earn one.

## Status

| # | Sub-project | Status |
|---|-------------|--------|
| 1 | Foundation reset | **Complete** — 2026-08-23 |
| 2 | Hosting migration | **Complete** — 2026-08-24 |
| 3 | Asset engine | **Complete** — 2026-08-25 |
| 4 | Page redesigns | Not started |
| 5 | Case-study content | Not started |

Each sub-project gets its own design → spec → implementation-plan cycle when it starts. Statuses here get updated as phases complete.

## 1 — Foundation reset

**Goal:** make the ground solid so the redesign moves fast and nothing contradicts anything.

- Design token system from the brandbook (Tailwind v4 `@theme`): color scales, semantic tokens for dark + light themes (dark-first), Roboto via `next/font`, type/spacing/motion scales; internal `/dev/tokens` preview page.
- Content audit: reconcile github.com/osyounis against `projects.json` (add Radar Moboard etc.), produce `docs/CONTENT-AUDIT.md` (local-only, gitignored — this repo is public) + canonical-facts sheet from Omar's answers, current résumé, and his saved section text (`docs/content/`).
- `projects.json` schema v2: `tier` (flagship/showcase/card), `brand` fields for the asset engine, consolidated `links`, Zod validation in tests.
- Repo hygiene: delete `/capabilities` (301 → `/about`), re-enable ESLint, rewrite CLAUDE.md fresh, refresh README, create `docs/DECISIONS.md`.

**Exit:** build/tests/lint green, tokens render in both themes, schema migrated with no visual change, docs rewritten.

## 2 — Hosting migration (Vercel → Cloudflare Workers)

**Goal:** the current, known-good site running on the platform everything after is built for.

- `@opennextjs/cloudflare` adapter + `wrangler.jsonc`; ImageKit as the `next/image` loader replacing Vercel's optimizer (Cloudflare Images kept as the documented fallback).
- Contact form and Resend removed — the site's only server-side mutation, only secret, and only runtime third-party dependency. `/contact` presents direct channels; its redesign belongs to sub-project 4.
- OG cards moved from the runtime `/api/og` route to build-time PNGs in `public/og/` (`npm run generate:og`), because `sharp` + `node:fs` cannot run on Workers. Old `/api/og` URLs 307 to their static PNG.
- `@vercel/analytics` / Speed Insights swapped for Cloudflare Web Analytics (free, cookieless, auto-injected on the proxied zone — no script tag in the repo).
- Every route verified on a `workers.dev` preview, then against production: `/nahtadi/*`, showcase case studies, all four redirects, sitemap, robots, OG assets.
- DNS moved from GoDaddy→Vercel to Cloudflare and cut over; Vercel kept live until Cloudflare was verified. CI: **Cloudflare Workers Builds** — `main` → production, PRs → preview URLs.

**Exit:** met 2026-08-24 — hendaseh.com and www serve from Cloudflare Workers, 17/17 e2e green against production, Nahtadi URLs intact, Vercel analytics and Resend removed from the codebase. Deleting the Vercel project itself is deliberately deferred ~24h as rollback insurance.

**Needs from Omar:** done — Cloudflare account created, `wrangler login` completed, GoDaddy nameservers repointed. Three manual steps remain his:

1. **Enable Cloudflare Web Analytics** in the dashboard — until then the site collects no analytics at all.
2. **Delete the Vercel project** once the ~24h rollback window closes.
3. **Revoke the Resend API key** in the Resend dashboard and delete the stale local `.env.local` that holds it. The key was never committed (`.env.local` is gitignored and appears in no commit), so this is routine cleanup and revocation of a credential for a decommissioned service — not an exposure.

## 3 — Asset engine

**Goal:** one command per project produces its full, brand-consistent asset set — reusable on the website *and* copied into GitHub repos.

- **Art direction changed mid-flight.** v1 ("Apple-modern flat": flat geometric subject, full-bleed gradient tile, palette restricted to the gradient pair + white + one accent) was approved anchor-by-anchor, but rejected once the full 12-project catalog was generated and reviewed as a grid — colour in the background plus a flat white subject read duller and more uniform than Omar's own hand-made icons. v2 takes those icons as the source of truth instead: a **transparent floating subject carrying luminous multi-hue gradients inside itself**, composited by the code frame onto the project's own gradient. Locked in `assets/anchors/STYLE.md`, which preserves v1 for history. See `docs/DECISIONS.md`.
- **Generator: the Recraft REST API**, not Higgsfield — the Higgsfield spike found its best-fit model gated behind a paid plan, and independently, the style it would have generated was the rejected v1. Recraft uses a custom style trained on five of Omar's own icons and requires `controls.colors` set explicitly per project on every call — prompt text alone does not hold a palette.
- **Generation is the last resort, not the first.** Cheapest and most faithful techniques are tried before it, in order: keep the original artwork; deterministic HSL recolour when only hues are wrong; glyph extraction to lift a subject off its own background tile; image-to-image seeding from the original (strength 0.35–0.50); geometry seeding from real parametric shapes for technical subjects the model has no prior for; fresh text-to-image only where no artwork exists at all. Documented in `STYLE.md`.
- Deterministic compositor (`scripts/generate-assets.tsx`, `scripts/lib/compose.ts`) turns one committed, human-approved artwork PNG per project (`assets/artwork/<id>.png`) into four outputs in `public/images/projects/<id>/`: `icon.png`, `icon-squircle.png`, `card.png`, `github-banner.png`. Run with `npm run assets -- <id> [<id>…]` or `npm run assets -- --all`.
- Full existing 12-project catalog regenerated through the pipeline. Nahtadi is the one exception: its artwork is its real shipped App Store icon (`public/images/nahtadi/icon.png`), never AI-generated, and its catalog card now renders through the engine (on its own brand gradient) rather than using that transparent icon file as a card directly.

**Exit:** met 2026-08-25 — all 12 catalog projects have matching icon/squircle/card/banner assets generated from committed, approved artwork; `src/lib/__tests__/projects.test.ts` asserts every project's `image` path resolves to a real file. Adding a project's assets is: add the `projects.json` entry, get artwork approved, run `npm run assets -- <id>` (full recipe in [`README.md`](../README.md#adding-a-projects-assets)).

**Lessons carried forward, worth knowing before touching this again:**
- Colour must be chosen **per project** — derived from that project's `brand.gradient` or sampled off its existing icon — and passed via `controls.colors`. Reusing one amber/gold accent for 9 of 12 projects is the specific mistake that made the first full-catalog pass read monotonous; separately, dropping the `controls` field entirely on an image-to-image call shifted hues wildly (a purple helicopter went green, a red joystick went salmon).
- A subject vanishes against a card gradient close to it in both hue *and* value; for a **dark** subject the fix is a **lighter** ground, not a darker one — darkening made it worse.
- OG cards are pre-rendered PNGs (sub-project 2) and nothing in CI catches a gradient change going un-regenerated — it happened once during this work (`collision-avoidance-radar`); `npm run generate:og` after any gradient change is manual and easy to forget.

## 4 — Page redesigns

**Goal:** the UI/UX-forward site — every page designed, not templated.

- Home: full above the fold, real hierarchy, Nahtadi as flagship story.
- Projects: searchable/filterable grid built around the new assets; `/projects/[slug]` case-study template.
- About: Omar's arc (ME → ML → iOS) told with intent, from the canonical facts + his source text.
- Contact: simple, polished, direct channels only (email, LinkedIn, GitHub, résumé) — no form, no backend.
- Nahtadi pages: visual consistency pass, URLs and SEO untouched.
- Both themes, `prefers-reduced-motion`, WCAG-conscious contrast, no SEO regressions (metadata, JSON-LD, sitemap preserved).

**RESOLVED 2026-08-28 (Task B5) — meta descriptions were too long.** `/projects/[slug]` emitted each
project's full `description` from `projects.json` as both `description` and `og:description`. Measured on
`/projects/collision-avoidance-radar`: **261 characters**, against Google's ~150–160 and a social preview
cut around 125, so the tail was lost on every surface. The prescribed fix shipped: the route now reads
`project.tagline` for `description`/`og:description`/`twitter:description` and leaves `description` to the
page body. The whole catalog fits — the longest tagline is `brent-cuda` at 120 characters, the two live
case studies measure 120 and 98. Every other page's description was rewritten to ≤160 in the same pass.

**Open question — the positioning tagline (raised by Omar 2026-08-25).** The locked surface string is
`Software Engineer · iOS & Machine Learning`, and it currently appears on the home hero, the OG site card
(`src/lib/ogCards.ts`), and `layout.tsx`'s OG `alt`. Omar wants it reconsidered: he does and will do more
than iOS and ML, and the pair may read as narrower than his actual range — possibly just
`Software Engineer`. **This reopens a locked decision**, so it is a deliberate call for this sub-project,
not a copy tweak: dropping the specifics also drops the concrete proof (`iOS` is backed by a shipped App
Store app) that makes the line credible, so whatever replaces it has to carry range without going vague.
Whatever is chosen must land on every surface at once: `src/components/home/HomeHero.tsx`,
`src/lib/ogCards.ts` (site card tagline), `src/app/layout.tsx` (OG image `alt` + metadata titles),
`src/app/page.tsx`, `src/app/contact/page.tsx`, and `src/app/about/page.tsx`. The OG card is a
pre-rendered PNG and needs `npm run generate:og` re-run and committed.

**RESOLVED 2026-08-28.** The new locked surface string is
`Software Engineer · iOS, ML & Autonomous Systems`. It landed on the hero in Task B1 and on every
remaining surface in Task B5, with the site OG card regenerated and committed.

**Deviation from the paragraph above, recorded deliberately (Task B5).** That line lists "metadata
titles" among the surfaces the string must land on. **Sub-page titles no longer carry a tagline at all.**
The new string is 20 characters longer than `iOS & ML`; pasted into the old title shape it produced
`Hendaseh - Omar Younis | Software Engineer · iOS, ML & Autonomous Systems` at ~72 characters against a
~60-character truncation point, so every sub-page title would have been cut mid-string. Titles were
restructured instead, on Apple's and YouTube's observed pattern (`Apple Fitness+ - Apple`):

- Site-name slot is `Omar Younis`, not `Hendaseh` — nobody searches the domain, and the domain already
  renders beneath the title in a result. `Hendaseh` survives in `og:site_name` and in the homepage
  description.
- Sub-pages are `<Page> - Omar Younis` (19–42 chars), emitted from a single
  `title: { default, template: '%s - Omar Younis' }` in `src/app/layout.tsx` so the suffix cannot drift
  across five files again.
- The **homepage keeps the full tagline** — `Omar Younis - Software Engineer · iOS, ML & Autonomous
  Systems`, 62 chars. Apple's one-word homepage title rides on brand recognition this site does not have,
  and the title is the highest-value line in a search result.
- **The separator is a plain hyphen-minus (U+002D) with spaces**, one separator sitewide, matching the
  Apple/YouTube precedent the structure came from. Omar changed it from `·` on 2026-08-28. It is not an
  en dash, not an em dash, not a middot: an en dash is near-indistinguishable in a diff and would break
  every match silently. `·` now survives **only inside the locked tagline**, never as a title separator,
  so the two-separator-levels rationale that briefly existed no longer applies. `src/lib/ogCards.ts`
  carries no separator (name, tagline and footer are three rendered lines), so the OG PNGs were
  unaffected by this change.

The intent of "every surface at once" was **convergence — no surface still showing the old string** — and
that is fully satisfied: `grep -rn "iOS & Machine Learning\|iOS & ML" src/` returns zero hits. Repeating
the tagline in all five titles would additionally be repetitive boilerplate of the kind Google's own title
guidance calls out. **Do not "restore" the tagline to every title** — it reintroduces the length problem
this restructure exists to solve.

One consequential side effect, handled: a `title.template` on the root layout would have appended
` · Omar Younis` to `/nahtadi`'s frozen title. `src/app/nahtadi/layout.tsx` now declares
`title: { absolute, template }` instead of `{ default, template }`, which ignores the parent template.
Verified against the built HTML: all three `/nahtadi*` titles render byte-identical to before.

**Exit:** all pages shipped in both themes, Lighthouse/axe clean, SEO parity confirmed.

## 5 — Case-study content

**Goal:** depth where there's a story — especially the private Coast Guard work.

- Write and build showcase pages for the chosen tier-2 projects (from the audit): Radar Moboard, pilot training tracker, helicopter inventory, brent-cuda, prayer-time library, collision-avoidance (live embed).
- Sanitized visuals for private projects: screenshots/GIFs of shareable animations (Omar captures; pipeline/ImageKit processes), diagrams where screenshots can't be shown.
- Final tier assignment for every project; card-only projects link to GitHub.
- New `projects.json` entries added in this phase (`radar-moboard`, `a16-summarizer`) get their assets the same way as the rest of the catalog — the asset engine (sub-project 3) is already built: pick a subject, get artwork approved, `npm run assets -- <id>`. See [`README.md`, "Adding a project's assets"](../README.md#adding-a-projects-assets).

- **App Store fact sync.** Apple's public lookup API (`https://itunes.apple.com/lookup?id=<id>`) returns `price`, `version`, `averageUserRating`, `userRatingCount`, `sellerName`, `contentAdvisoryRating` and `minimumOsVersion` with **no auth** — every hand-maintained App Store fact on `/nahtadi`. **Three had silently drifted before anyone checked** (N1, 2026-08-28: the ratings count matched no source, the support page's version was two releases stale, and the JSON-LD price was unverifiable because it appeared nowhere visible). **Shape:** a scheduled GitHub Action that diffs the API against `projects.json` and **opens a PR** when values change — never an auto-commit. The repo is public, price changes deserve review, and a broken API should fail loudly rather than write garbage into structured data Google reads. The site cannot poll for this itself: `open-next.config.ts` pins `staticAssetsIncrementalCache`, which forbids revalidation. **CAVEAT:** `userRatingCount` is **per-storefront and defaults to US**; the worldwide total needs the authenticated App Store Connect API. That asymmetry is why `appStoreRating.count` is deliberately stored as the US figure (7) rather than the worldwide one (9) — a narrower number the automation can keep right beats a truer number it cannot reach. See `docs/superpowers/mockups/nahtadi/COPY-LOCKED.md` §10 for the verified fact ledger and row H1 for the reasoning. Design this alongside the standing ask for a **low-friction `projects.json` intake path** — same pattern, same file, and neither should be built without the other in view.

**Exit:** every repo/project accounted for at its right tier; private projects presentable without revealing anything sensitive.

## Standing notes

- **Backend:** none — and now literally none: the contact form and **Resend are decommissioned** (2026-08-24), so the site has no server-side mutation, no secret, and no runtime third-party dependency. If a backend is ever needed, **Supabase** is the designated choice (see `docs/DECISIONS.md`).
- **Hosting:** Cloudflare Workers via `@opennextjs/cloudflare`; CI by Workers Builds. `open-next.config.ts` pins `incrementalCache: staticAssetsIncrementalCache`, which **forbids revalidation** — sub-projects 4–5 must move to a KV-backed cache before adding ISR, a server action, an API route, or the composable cache.
- **Connected tooling:** GitHub MCP, ImageKit API + DevTools MCP (authenticated 2026-08-23). Asset generation (sub-project 3): **Recraft REST API**, called manually from a local key in `.env.local` — no generation code ships in the app. Higgsfield was spiked and superseded before use (see `docs/DECISIONS.md`); it remains a documented fallback for video only.
- **Résumé + section text:** Omar supplies during the Phase 1 content audit (`docs/content/`, local-only and gitignored); the résumé in `public/` is outdated until then. Everything in `docs/content/` is **raw material only** — possibly outdated or rough by Omar's own assessment; final copy is workshopped with him during phases 4–5, never published verbatim.
