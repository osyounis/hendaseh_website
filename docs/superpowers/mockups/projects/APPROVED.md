# Projects + Case-Study Template — APPROVED design contract (M2, 2026-08-26)

**Approved mockups (visual contract for Task B2):**
- `v5.html` — dark (canonical): Projects page + two case-study instances (brent-cuda, collision-avoidance-radar)
- `v5-light.html` — light companion (Apple gray ladder per the Home v11 contract; same ruleset governs)
- History: v1 → v4 with Omar's review; superseded files kept.

## Projects page

- **Header:** eyebrow `PROJECTS`, heading `Everything I've built.` — **count-free by rule** (nothing in headline/sub may state a number that changes when projects are added). The only count is the computed `N of M projects` line.
- **Sticky filter bar** (Apple local-nav pattern): search + category chips in a translucent `backdrop-blur` bar, `position: sticky; top: 0`, hairline bottom border. Always reachable regardless of catalog length.
- **Search:** live, unanimated filtering (Emil frequency rule — instant reflow, no card animations on filter). Matches name + description + tech keywords. Designed empty state ("Nothing matches …").
- **Chips:** All / iOS / Machine Learning / Scientific Computing / Data Tools / Engineering Tools — single-select, from `projects.json` categories.
- **Card anatomy:** squircle icon 84px (never cropped) · title · 1–2 line description · action row. Whole card is NOT the link; actions are explicit pills.
- **Tier-action grammar (the rule):** story-action + artifact-action.
  - flagship (Nahtadi): `The story →` (→ `/nahtadi`) + ` App Store` pill (→ App Store listing). Full-width green card; **arch icon on a WHITE tile** (transparent icon must never sit on a same-hue ground).
  - showcase: blue `Case study →` pill (→ `/projects/[slug]`) + octocat `GitHub` pill. **No separate Live-demo pill** — the demo lives inside the case study.
  - card tier: octocat `GitHub` pill only.
  - private (USCG): gold `USCG · PRIVATE` badge; plus blue `Case study →` where a sanitized story exists/planned (tier flip in phase 5). Never a dead link.
- **Pills:** icon + label (octocat 15px,  glyph), 13px/700 text, radius 999px, press `scale(.96)`. Icon+label always — never icon-only.
- **Copy rule (sitewide from here): no em dashes, no AI-cadence.** Plain sentences, concrete numbers spelled naturally.

## Case-study template (`/projects/[slug]`)

- **Hero:** project-palette gradient; breadcrumb `← All projects`; icon 132px; title + one-line thesis; action buttons — GitHub (octocat, 18px glyph) and, when an embed exists, primary `Launch live demo ↓` **anchoring to the in-page embed**; 3-stat row (real numbers only).
- **Body:** `THE PROBLEM → THE APPROACH → THE IMPACT` as eyebrow + statement headings, prose ≤760px, 1.75 leading. **Media slot** (16:9 figure + caption) for phase-5 charts/GIFs; **embed slot** loads the live demo in place (Streamlit today; demos hosted on-site under case studies is the standing intent).
- **Scroll reveal:** sections/figures rise 14px + fade, 450ms strong ease-out, once (IntersectionObserver, `-80px` margin), fully static under reduced motion.
- **Bottom rhythm:** content → space → ONE hairline (the footer's). The prev/next nav row has no border of its own — never stack hairlines.
- **App Store artwork rule:** cards use the plain  glyph pill; the official "Download on the App Store" badge appears only on `/nahtadi`, unmodified, per Apple marketing guidelines.
- **Bottom nav — fixed slots (Familiarity rule):** left slot ALWAYS `← All projects`; right slot ALWAYS `Next case study` as an icon card (46px squircle + label). No "previous". Next = following showcase-tier project in catalog order, wrapping.
- Tech chips row in IMPACT; footer standard.


## Mobile rules (sub-880, added after phone review 2026-08-26)

- Hero cluster: horizontally centered; scale the whole cluster with `transform: scale()` on small viewports — never fixed-width geometry that can drift off-center.
- Feature/work tiles: never stack into full-width sprawl — compact horizontal layout (icon ~84px left, text right), same as small tiles.
- Every future mockup ships an explicit phone-width pane; "implementer judgment" mobile layouts are no longer acceptable.

## Build notes for B2

- Grid/search/filter behaviors replace `FilterableProjectList`/`ProjectFilter` visuals but preserve semantics; data via `src/lib/projects.ts` helpers only (`getProjectHref` drives the story-action).
- Showcase pages migrate to the template with this mockup's real copy (Omar-approved); `/projects/reddit-nlp` still 404s (guarded e2e).
- Live search must remain client-side and instant; no debounce animation.
- Both themes; all Apple-calibration rules from the Home contract apply (pills, contrast floors, hairlines).
- Radar embed keeps the synthetic-data line: "Everything on screen is synthetic training data."
