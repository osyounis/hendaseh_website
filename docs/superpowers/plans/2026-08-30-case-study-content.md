# Case-Study Content Implementation Plan (Sub-project 5 — final phase)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans for the B-tasks. Steps use checkbox (`- [ ]`) syntax.
>
> **Execution split:** W-tasks are interactive content workshops — Fable + Omar, in chat, with the design/dataviz/xlsx skills; their outputs are LOCKED files under `docs/superpowers/content/` (gitignored dir? NO — see note in W1: copy files are committed; only raw source material stays local). B-tasks run in CLI sessions, one at a time, against this plan + the spec + the page contracts. **No B-task consumes a W-task output that Omar has not approved.**

**Goal:** Three new case studies live, catalog at final tiers with two new asset-backed entries, embed retired with redirects, Home swapped, both automations merged. Program complete.

**Spec:** `docs/superpowers/specs/2026-08-30-case-study-content-design.md` (binding, including its guardrails). Page contracts in `docs/superpowers/mockups/*/APPROVED.md` remain law; the case-study template is NOT redesigned.

## Global Constraints

- SYNTHETIC DATA ONLY for Coast Guard visuals; every private-work visual carries a visible "synthetic data" caption. No real operational data, unit names, or workflows. No mention of the pending CG demo/sale anywhere.
- Copy law: no em dashes, no AI cadence, canonical facts only (CONTENT-AUDIT + résumé win conflicts), skills-defensibility, a16 never implies Core ML, tracker always marks VOLUNTEER + Commandant framing.
- Routes: `/projects/collision-avoidance-radar` → 308 → `/projects/radar-moboard`; `/projects/reddit-nlp` stays 404 (guarded). New slugs only via `generateStaticParams`.
- Assets only through the engine (`STYLE.md` ladder, Omar approves artwork, `npm run assets -- <id>`); OG cards regenerated and committed whenever entries change.
- Per B-task: `npm run build && npm run test:run && npm run lint` green + e2e for touched routes; commits on `dev`; trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` (or the model actually doing the work, per B1's ruling).

---

## W-tasks (workshops, Fable + Omar, in order of material readiness)

### Task W1: Radar Moboard — copy + visuals ⏸

**Omar brings:** synthetic captures per spec (board screenshots, animation GIF, 3D C-view; old-app default parameters; nothing real).
**Produced, Omar-gated:** `docs/superpowers/content/radar-moboard-COPY.md` (locked verbatim on approval, committed — it contains only publishable copy) + approved visuals staged under `docs/superpowers/content/radar-moboard/` (committed; they are public-safe by construction).

- [ ] Copy drafted to the template's slots: hero thesis line · 3 ledgered stats (two weeks to port; 12-problem verification corpus; +3D views vs prototype or similar ledgered claim) · THE PROBLEM (paper plotting + the prototype's honest limits incl. 000-heading assumption) · THE APPROACH (the TS monorepo, CI answer-key verification, learning TS with Claude Code per résumé) · THE IMPACT (what it does today; silent on the demo) · tech chips.
- [ ] Visuals selected + captioned ("All scenarios synthetic."); GIF placement in the media slot; prototype screenshot in the origin chapter.
- [ ] Apple-calibration + both-theme check on the fitted layout BEFORE Omar review (standing rule).

### Task W2: Pilot Tracker — workbook, diagram, copy ⏸

**Omar brings:** the dashboard `.xlsx`, exported VBA source, 2 sanitized real rows. These RAW inputs stay in gitignored `docs/content/` — never committed.
**Produced, Omar-gated:** the filled workbook (local, gitignored — Omar screenshots it in Excel); `docs/superpowers/content/pilot-tracker-COPY.md`; the flow diagram SVG/PNG (committed once approved).

- [ ] Claude reads the VBA: layout, computed columns, status logic, conditional-format colors. Uses the xlsx skill to produce the workbook AS IF THE MACRO RAN: ~10 synthetic pilots (provably fake names, generic "Air Station A/B" units, plausible qual states/dates), colors applied per the VBA's own rules.
- [ ] ⏸ Omar approves dataset + look → screenshots in real Excel → screenshots staged (they are then public-safe: synthetic by construction, captioned).
- [ ] Flow diagram (sources → consolidation → dashboard) in site-consistent style, both themes.
- [ ] Copy: medal (Commandant framing) + VOLUNTEER badge context + 6-weeks→2-days + fleetwide adoption + sole-maintainer + one line acknowledging the inventory system (which stays a card). Stats row from ledgered numbers only.

### Task W3: a16-summarizer — chart, screenshots, copy ⏸

**Omar brings:** SwiftUI app screenshots from the iPhone 14 Pro.
**Produced, Omar-gated:** `docs/superpowers/content/a16-summarizer-COPY.md`; the ROUGE chart (dataviz skill; data straight from the repo's `results/rouge_comparison.md`; both themes; committed).

- [ ] Copy: the thesis (below Apple's hardware line) · stats (0.29 → 0.46 ROUGE-L; 880 MB at 4-bit; A16/6 GB) · PROBLEM (Apple's line, why) · APPROACH (QLoRA on the 3080, licensing-driven choices, 4-bit MLX, MLX Swift) · IMPACT (measured tradeoffs, tokens/sec + memory from the repo's own profiling) · NO Core ML claims · Coursera course origin framed as "putting the Gen AI with LLMs coursework into practice" (true, humble, credible).

### Task W4: Artwork for the two new entries ⏸

- [ ] Subjects + per-project gradients chosen with Omar per `STYLE.md` (color never defaulted): radar-moboard (suggestion to react to: maneuvering-board rose with vessel traces; distinct from the retired entry's icon or an evolution of it) and a16-summarizer (suggestion: chat-bubble distilling into a chip, or phone with neural motif).
- [ ] Generate per STYLE.md's technique ladder (Recraft API, `controls.colors` mandatory) → ⏸ Omar approves → commit `assets/artwork/<id>.png`.

---

## B-tasks (CLI, sequential)

### Task B-A: Catalog, routes, Home swap

> **AMENDED 2026-08-31, during execution.** B-A as written flipped three projects
> to `showcase` and left the case-study content to B-B. That cannot build:
> `src/app/projects/[slug]/page.tsx` throws when a showcase project has no
> `caseStudies.ts` entry, and `generateStaticParams` returns every showcase
> project, so the throw happens at prerender. **Any tier flip must therefore land
> its case-study copy in the same commit.**
>
> Consequently **`coast-guard-pilot-tracker` was NOT flipped in B-A** and remains
> `card`. W2 has not produced its copy, so there is nothing to land alongside the
> flip. **Its flip moves to the task immediately after W2**, which must change the
> tier and add the `caseStudies.ts` entry together. B-A shipped the two projects
> whose locked copy already existed: `radar-moboard` and `a16-summarizer`.

**Files:** `src/data/projects.json`, `next.config.ts`, `src/app/projects/[slug]/*` (params/data only), Home components (grid + orbit constants), `tests/e2e/redirects.spec.ts` + case-study specs, `public/images/projects/*`, `public/og/*`

- [ ] `projects.json`: replace `collision-avoidance-radar` entry with `radar-moboard` (showcase; no `links.embed`; new copy/stats from W1's locked file; keywords keep "collision avoidance" so search still finds it); add `a16-summarizer` (showcase, W3 copy, links.github + huggingface as `links.live`?— no: schema has github/live; HF model link goes in case-study body copy, not card actions); flip `coast-guard-pilot-tracker` to showcase; watermark-remover stays card (unchanged entry, removed from Home feature constants only).
- [ ] Home: work-grid compact row swaps wm → a16 with `Case study ›` action (tier-driven); hero orbit swaps the wm satellite for a16's `icon-squircle.png`. Home contract note appended (one line, referencing the spec).
- [ ] `next.config.ts`: add `{ source: '/projects/collision-avoidance-radar', destination: '/projects/radar-moboard', permanent: true }`.
- [ ] `generateStaticParams` now returns: brent-cuda, radar-moboard, coast-guard-pilot-tracker, a16-summarizer. e2e: old slug 308s to new; reddit-nlp still 404s; embed-loads test deleted; sitemap reflects the four slugs.
- [ ] Run `npm run assets -- radar-moboard a16-summarizer` (artwork from W4 committed first) and `npm run generate:og`; commit generated outputs; files-exist + gradient-sync tests green.
- [ ] Grep-clean sweep: no `Launch live demo`, no embed URL, no stale "Live demo" stat anywhere in `src/`.

### Task B-B: Populate the three case studies

- [ ] Copy lifted VERBATIM from the three locked COPY.md files into the template's data source; visuals placed in media slots with their synthetic-data captions where required; ROUGE chart + flow diagram wired with both-theme sources.
- [ ] Playwright: each new slug renders hero/stats/sections; captions present on private-work visuals; a11y/theme CI suite green.
- [ ] ⏸ Omar reviews all three pages in browser + phone, both themes → commit.

### Task B-C: The two automations

**Files:** `.github/workflows/appstore-sync.yml`, `.github/workflows/intake.yml`, `scripts/appstore-sync.mjs`, `scripts/intake.mjs`

- [ ] **Sync:** weekly `schedule` + `workflow_dispatch`. Script: fetch `https://itunes.apple.com/lookup?id=<id>` (id from projects.json), diff the ledgered fields (price, version, averageUserRating, userRatingCount-US) against `projects.json`/nahtadi data files; reviews: fetch each configured storefront feed (`us`, `jo` today; storefront list in config), merge; **pinned review located BY ID — if absent, `process.exit(1)` with a loud message**; on any diff, write files and open a PR via `peter-evans/create-pull-request` (never push to dev/main); on API failure, fail the run — never write.
- [ ] **Intake:** `workflow_dispatch` with `repo` input (and an equivalent local `npm run intake -- <repo>`): fetch repo metadata + README via the GitHub API, draft a schema-v2 entry (id, title, description draft, tech from languages, `tier: "card"`, `stats` from stars, placeholder tagline + gradient marked `TODO-OMAR`), validate against the Zod schema (with TODOs allowed only in a draft branch), open a PR for Omar to edit. Artwork flow stays manual (the PR body links the STYLE.md recipe).
- [ ] Proofs: sync dry-run produces a PR on a forced diff; pinned-review-missing path exits 1 (unit-tested by stubbing the feed); intake generates a real PR for an existing repo (closed unmerged as the proof artifact).

### Task B-D: Closeout

- [ ] `docs/ROADMAP.md`: sub-project 5 → **Complete**; program complete. `docs/DECISIONS.md`: entries for the radar merge + embed retirement, the four-pillar tier finals, the automation pattern (PR-never-autocommit). `.claude/CLAUDE.md`: catalog/tier table refreshed, automations documented, phase language updated to "program complete — maintenance mode".
- [ ] Full suite + `BASE_URL=https://hendaseh.com npm run test:e2e` after deploy; PR dev → main (⏸ Omar merges); verify the four case-study URLs + redirect in production.
