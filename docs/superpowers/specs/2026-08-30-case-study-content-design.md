# Case-Study Content — Design Spec

**Date:** 2026-08-30
**Sub-project:** 5 of 5 — the final phase (see `docs/ROADMAP.md`; program decisions in `docs/DECISIONS.md`)
**Status:** Awaiting review

## Goal

Populate the case-study template B2 built with the stories that earn it, settle every project's final tier, add the two new catalog entries with engine assets, and ship the two scoped automations. When this phase's exit criteria pass, the redesign program is complete.

## Decisions locked in this design (2026-08-30, with Omar)

### The case-study architecture: four pages, four pillars

Case studies are the site's editorial voice; scarcity is the signal. Final set, each backing one positioning claim:

| Case study | Pillar | Status |
|---|---|---|
| `brent-cuda` | GPU / scientific computing | Live since B2 — untouched |
| `radar-moboard` | Autonomous systems | NEW — the centerpiece |
| `coast-guard-pilot-tracker` | Shipped production impact | NEW |
| `a16-summarizer` | On-device AI | NEW — reversed from card after repo review: it has a thesis (running Apple's own on-device recipe below Apple's hardware line), full-lifecycle evidence, and measured tradeoffs |

Plus `/nahtadi` (flagship, its own page) = five deep pages total.

### Final tiers, whole catalog (closes every deferred decision)

- **flagship:** nahtadi.
- **showcase:** brent-cuda, radar-moboard (new entry), coast-guard-pilot-tracker (promoted), a16-summarizer (new entry).
- **card:** islamic-prayer-time (confirmed: its depth lives on `/nahtadi`), cycloidal-drive-creator (CLOSED after deferral: a showcase would need the params→preview GIF as its centerpiece and Omar does not want to produce one; tier remains one field away if that changes), coast-guard-inventory (data exists but no honest visuals; the tracker case study carries one line of context about it), image-watermark-remover, asl-detector, wildfire-predictor, reddit-nlp, new-game-plus, mini-compiler.

### The radar merge

- `collision-avoidance-radar` and `radar-moboard` become **one entry: `radar-moboard`** (showcase). The case study tells the progression: Python/Streamlit prototype → its limits (including, honestly, the 000-heading assumption) → the verified TypeScript monorepo rebuilt in two weeks with the 12-problem answer-key corpus. Progression is the story; one entry, not two.
- **Route:** `/projects/collision-avoidance-radar` 308-redirects to `/projects/radar-moboard` (no route change without a redirect — sitewide law). `generateStaticParams` and the e2e guards update accordingly; `/projects/reddit-nlp` stays dead.
- **The live embed is RETIRED** (known correctness bug on a job-search site; superseded by the rewrite). Prototype-era screenshots replace it in the origin chapter. Full retirement sweep (most of it collapses into the merged `projects.json` entry, since card copy is data-driven): no `links.embed`; case-study hero loses `Launch live demo`; the "Try it in the browser" impact section is replaced; B2's embed-loads e2e test is replaced by the redirect test; Home + projects cards pick up new stats from data.
- **Business guardrail:** the Coast Guard demo is pending. Copy never mentions the potential sale, pricing, or the demo. The public repo stays private.

### Home page swap (amends `home/APPROVED.md`)

`image-watermark-remover` leaves the Home work grid AND the hero orbit swarm; `a16-summarizer` takes both slots. Since a16 is showcase tier, its Home tile carries `Case study ›` per the tier-action grammar (the compact row is not card-tier-only; tier drives the action). The swarm satellite uses a16's engine squircle icon.

### Visuals: who produces what

**Omar captures** (all synthetic-data guardrails binding):
- radar-moboard: board screenshots, an animation GIF, the 3D "C-view" screenshot — every scenario synthetic, using the same default parameters as the old public app so the two read as one scenario (per audit D.6). No real operational data, unit names, or workflows.
- a16-summarizer: SwiftUI app screenshots on the real iPhone 14 Pro.
- pilot tracker: screenshots of the actual Excel/VBA dashboard **filled with the synthetic dataset Claude designs** (below).

**Claude produces, Omar gates:**
- The tracker's **synthetic dataset AND filled workbook**: Omar supplies the dashboard .xlsx, its VBA source, and two sanitized real rows; Claude reads the VBA to learn the layout, computed columns, and conditional-format colors, then produces the workbook as if the macro had run, with ~10 plausible-but-provably-fake pilots and generic unit labels ("Air Station A/B" style). This simulates the run because the VBA cannot execute on Omar's Mac. Omar approves the dataset and the look BEFORE taking screenshots in real Excel.
- The tracker's **flow diagram** (sources → consolidation → dashboard).
- The a16 **ROUGE chart** (base vs fine-tuned, from the repo's own `results/rouge_comparison.md`), built with the dataviz skill for the template's media slot.
- **Every visual on private-work pages carries a visible "synthetic data" caption** — the guardrail, made legible.

### Copy rules for the three new case studies

All sitewide copy law applies (no em dashes, no AI cadence, canonical facts only, résumé wins conflicts, skills-defensibility). Specific guardrails: pilot tracker leads with the Commandant-awarded medal framing and the VOLUNTEER truth; a16 copy never implies Core ML happened (repo lists it as an unattempted stretch); radar-moboard copy stays pre-negotiation silent. Stat rows use only ledgered numbers (6 weeks → 2 days; +0.9 ROUGE-L; 847 MB at 4-bit; 12-problem verification corpus; two weeks to port).

### New entries through the existing machinery

`radar-moboard` and `a16-summarizer` enter `projects.json` (schema v2, gradients chosen per-project per `assets/anchors/STYLE.md` — never defaulted), artwork generated per STYLE.md's technique ladder and **approved by Omar**, then `npm run assets -- <id>`, then `npm run generate:og` with committed output. The files-exist test and gradient-sync test keep it honest.

## The two automations (designed together, per ROADMAP)

Shared pattern: **a scheduled/invocable GitHub Action that writes `projects.json` and opens a PR — never an auto-commit.**

1. **App Store fact sync:** scheduled Action diffs Apple's public lookup API against `projects.json` (price, version, rating, count per the ledger in `nahtadi/COPY-LOCKED.md` §10); on drift it opens a PR. `userRatingCount` stays the US-storefront figure by decision (H1). The reviews feed sweeps **all storefronts** (currently 4 US + 2 JO); the pinned review is pinned **by review ID**, and a missing pin **fails the run loudly** — never silently reorders. Broken API = failed run, never garbage writes.
2. **Low-friction intake:** one command/manually-triggered Action that takes a repo name, drafts a schema-v2 `projects.json` entry from the repo's metadata and README, and opens a PR for Omar to edit and merge — the human writes judgment (tier, tagline, gradient), the machine writes boilerplate. Artwork remains the manual STYLE.md flow.

Neither ships without the other in view; they share the PR-opening plumbing.

## Execution shape

Same M/B split as phase 4: **content workshops here (Fable + Omar)** — case-study copy drafted and gated like the About page, synthetic dataset designed and approved, chart/diagram produced against the template's slots, all checked against the Apple-calibration ruleset in both themes before Omar sees fitted pages. **CLI build sessions** populate the template, make catalog/route changes, and build the automations against this spec. One build session at a time.

## Out of scope

- Any redesign of the case-study template or any page (the contracts are law; the template already exists).
- Making the radar-moboard repo public, or any content about the potential Coast Guard sale.
- The worldwide ratings total (needs authenticated App Store Connect; decided against).
- README banners for GitHub repos (still the optional follow-on from phase 3).

## Success criteria

- Three new case studies live and Omar-approved, each with real (synthetic-captioned where private) visuals in the template's slots; brent-cuda untouched.
- Catalog: every project at its final tier; `radar-moboard` + `a16-summarizer` entries complete with engine assets and fresh OG cards; Home grid + orbit swapped; old radar slug 308s; embed fully retired (grep-clean); `/projects/reddit-nlp` still 404s.
- Both automations merged: sync Action proven by a dry-run PR; intake proven by generating the PR for a real repo; pinned-review failure path tested.
- Full suite green (unit, e2e incl. updated guards, lint, both-theme CI audit); production deploy verified.
- ROADMAP marks sub-project 5 — and the program — complete.
