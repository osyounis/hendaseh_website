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

- **Hero:** project-palette gradient; breadcrumb `← All projects`; icon 132px; title + one-line thesis; action buttons — GitHub (octocat, 18px glyph) and, when an embed exists, primary `Launch live demo` with the chevron-down-in-circle glyph (grammar v2: in-page jump) **anchoring to the in-page embed**; 3-stat row (real numbers only).
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
- Mobile filter chips: single horizontal scrolling row (iOS-native pattern, per B2 ruling upheld) — scrollbar hidden, partial last chip as the scroll affordance. Never wrap into multiple rows.
- Case-study media slot renders NOTHING when a project has no media (the mockup's hatched placeholder was design scaffolding, not visitor-facing content).
- DEFERRED TO B6 (named item): case-study nav-over-hero treatment — translucent dark nav with adaptive link colors so the hero reaches under the nav per the mockup; until then the light-theme band above dark heroes is an accepted temporary seam.

## Build notes for B2

- **Card hover is SHARED CODE (Omar's explicit instruction):** apply the existing built `.home-tile` class/tokens to all project cards — never re-implement the hover. Same ease-brand curve, 280ms, -6px lift, tile-hover tokens.

- Grid/search/filter behaviors replace `FilterableProjectList`/`ProjectFilter` visuals but preserve semantics; data via `src/lib/projects.ts` helpers only (`getProjectHref` drives the story-action).
- Showcase pages migrate to the template with this mockup's real copy (Omar-approved); `/projects/reddit-nlp` still 404s (guarded e2e).
- Live search must remain client-side and instant; no debounce animation.
- Both themes; all Apple-calibration rules from the Home contract apply (pills, contrast floors, hairlines).
- Radar embed keeps the synthetic-data line: "Everything on screen is synthetic training data."

## Amendment — entrance cascade (2026-08-28)

The contract above specifies **no entrance** for this page. It gets one now: Home, About and Contact all animate in, and Omar caught the odd one out unprompted. Apple's Familiarity principle makes that an inconsistency defect rather than a preference, so the fix is to reuse the established pattern, not to invent a new one for this page.

**The pattern is the one `.about-enter` and `.contact-enter` already ship:** a CSS animation, `0.6s`, `--ease-brand`, `opacity 0 → 1` and `translate 0 18px → 0`, with `both` fill and a per-element `--enter-delay`. It is CSS, so it runs and settles with no JavaScript, and nothing is served at `opacity: 0` as a permanent state.

**Four beats, ~120ms apart:**

1. `0s` — the `PROJECTS` eyebrow
2. `0.12s` — `Everything I've built.`
3. `0.24s` — the lede beneath it
4. `0.36s` — **the sticky filter bar and the grid, arriving together as one unit**

### Why beat 4 is one unit, and why NO CARD may ever be animated

This is load-bearing, not styling. The Search rule above mandates **live, unanimated filtering — instant reflow, no card animations on filter.** Cards are keyed by project id, so React remounts them as the filtered set changes; an entrance on a card (or on any container carrying a query-dependent `key`) would therefore **restart on every keystroke**, which is the behaviour that rule forbids, arrived at from the other direction. Animating the block **once**, on containers whose identity never changes, is what makes the replay structurally impossible instead of merely avoided.

**Do not "improve" this into a per-card stagger.** `tests/e2e/projects-filter.spec.ts` requires zero animations on every card before and during filtering, and `tests/e2e/projects-entrance.spec.ts` stamps each animated container and re-reads the stamp after four successive keystrokes — a remount destroys it and the test goes red.

### Why the bar and the grid are siblings, not one wrapper

`.projects-bar` is `position: sticky; top: 0`, and a `transform` **or** a `translate` on an **ancestor** creates a containing block that can break sticky positioning. One animated wrapper around the bar and the grid would inherit exactly that for the length of the animation. They are animated as **siblings** instead, so the bar has no animated ancestor at all and only carries the animation on itself, where sticky is unaffected. Beat 4's delay is declared **once**, in the `.projects-enter-body` class, because the two elements live in two different components and a number written twice is a number that drifts.

Verified, not assumed: the entrance spec asserts no ancestor of the bar has an animation, parks the bar's own animation mid-flight and confirms it still sticks (top within its own remaining offset while a `translate` is applied), then confirms `top: 0` exactly once settled and again at the bottom of the page.

**Reduced motion:** fully static, like the other three pages — the end state, never a paused frame.

## Amendment — case-study hero entrance cascade (2026-08-28)

The case-study template above specifies the hero **without** an entrance. It gets one now, for the same reason `/projects` did: every other hero on the site animates in and this one did not. **Scope is the hero only** — the body's `[data-reveal]` scroll reveals are a separate system and are untouched. `ScrollReveal` deliberately arms only below-fold elements, which is precisely why `.case-hero` was never animated by it.

**The pattern is the established one:** `0.6s`, `--ease-brand`, `both` fill, per-element `--enter-delay`, `opacity 0 → 1` and `translate 0 18px → 0`. Pure CSS, so it runs and settles with no JavaScript.

**Five beats, 100ms apart, in the hero's own reading order:**

| Delay | Element |
| --- | --- |
| `0s` | breadcrumb (`All projects`) |
| `0.1s` | project icon |
| `0.2s` | **title and thesis together** |
| `0.3s` | action buttons |
| `0.4s` | stat row |

Six beats were specified; the title and its thesis are **one** beat because they are one statement inside one block element, and 100ms apart they read as fussy rather than as sequence. Five is between About's four and Contact's seven.

**Hero elements take `.case-enter`; they never take `data-reveal`.** The two systems animate different properties for different reasons and are not mixed on one element. Both directions are asserted in `tests/e2e/case-study-entrance.spec.ts`.

### The wrapper-vs-`translate` decision: BOTH

An animation's filled end state beats every normal declaration in the cascade. A `transform`-based entrance ending at `transform: none`, left on an element that also hovers or presses with a transform, kills that response permanently and silently. **This codebase has been bitten by it twice** — B3's `.home-tile` hover, and the note that now stands in `contact.css` — and the hero's action buttons are `.pill`s whose `:active` **is** `transform: scale(0.97)`.

Both available defences are used, not one:

1. **The entrance rides on `translate`**, an independent property the browser composes *with* `transform`, so the two can never collide. This is the same choice the reveal system made in B3.
2. **`.case-enter` is applied to `.case-actions`, the wrapper** — never to a pill. The buttons carry no animation at all.

Either alone would be sufficient. Together, the behaviour cannot regress from someone changing just one of them.

**Enforced, not remembered:** the spec presses each hero pill *after* the entrance has finished and requires the live computed `transform` to reach `matrix(0.97, 0, 0, 0.97, 0, 0)`, and separately requires each pill to rest at `transform: none`. Reintroducing a transform-based entrance on the buttons fails both. (Verified by doing exactly that and watching it go red.)

**Reduced motion:** fully static — the end state, never a paused frame.
