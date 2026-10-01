# radar-moboard intercept: case-study update — design

**Date:** 2026-09-30 · **Status:** approved in brainstorming, awaiting written-spec review
**Scope:** the `radar-moboard` case study (`src/lib/caseStudies.ts`), its catalog
entry (`src/data/projects.json`), and the clips block (`CaseStudyClips` +
`src/app/styles/case-study.css`). Maintenance-mode change against the finished
system; no new route, no URL change, no redirect.

## 1. Why

radar-moboard gained a second capability upstream: **intercept at time T**, which
finds the one course and one speed that put own ship on a contact at a set time, and
shows that altering at the second observation is the unique lowest-speed intercept.
The case study describes only collision avoidance, and two of its numbers have gone
stale (tests, tutorials).

Ruled with Omar (2026-09-30):

- The intercept is presented as a **second capability**, a peer of avoidance, not an
  addendum and not a separate chapter.
- It is **ungraded** and must stay outside every sentence that claims grading. The
  thesis ("graded against two independent answer keys") is unchanged.
- Public framing stops at "the question a boarding approach asks". No requester is
  named, and nothing implies adoption, a sale or a negotiation.

## 2. Copy

**Source of truth: `docs/superpowers/content/radar-moboard-COPY.md` §7** (locked
2026-09-30), tracked alongside this spec. Lift every string mechanically. §7 supersedes the matching rows in §1–§3 of the
same file.

Summary of what changes, for orientation only (§7 holds the exact strings):

| Where | Change |
|---|---|
| stats | `12 days` leaves the stats (it stays in Approach ¶1). New order: `16 problems` (unchanged) / `1,689 tests` · `passing with both answer keys loaded` / `Alter now` · `the lowest-speed intercept, every time` |
| Approach ¶1 | `42 of them` → `44 of them` |
| Impact | heading unchanged; two NEW paragraphs after ¶1 (§7.3 ¶1b, ¶1c), each with one emphasis run |
| clip block | new fixed title, scenario tabs `Avoid` / `Intercept`, view labels unchanged, one caption per scenario, two new clip descriptions (§7.4) |
| `projects.json` | `cardStat` and `stats` → `1,689 tests`; `description` gains one intercept sentence and drops the false "in CI" (§7.5). `tagline` unchanged |

Facts behind the copy were re-verified against the radar-moboard repository at
`6370331` and are tabulated in §7.0. Test counts drift: **re-run the suite and
re-check 1,689 immediately before implementation**; if it has moved, stop and raise
it with Omar rather than editing the number.

## 3. Layout — "A, revised"

One player in one tile. Two switches on one row above the video: **scenario on the
left, view on the right.** Below the breakpoint where they no longer fit side by side
(they do not at 390px), they stack, scenario first, each full width. The fixed title
sits above the row; the scenario's caption sits under the video, as today.

```
 Avoid or intercept, from the board or the sea.
 ( Avoid | Intercept )                  ( Board view | Sea view )
              ┌──────────────────────┐
              │   one <video>, 1:1   │
              └──────────────────────┘
 <caption of the selected scenario>  All scenarios synthetic.
```

Rules, each from the Apple / UX review of the first mockup:

- **Both switches keep a touch target of at least 44px** (today's pill is 52px).
  The view switch is not shrunk to signal hierarchy; position and labels carry it.
- Same pill visual for both, with the existing travelling indicator. Equal-width
  columns within each switch still hold, so the short-and-parallel label rule applies
  per switch.
- The scenario switch comes first in reading, focus and tab order: scenario → view
  → video transport.

Considered and rejected: the view switch as a pill floating on the video (it covers
clip content where the sea-view contact enters, and stacks chrome on the transport
button); two separate tiles, one per scenario (a second ~800px tile in an already long
stack); stacking the two switches at all widths with the view switch made smaller
(sub-44px target, and size alone did not show which switch outranks the other).

## 4. Data shape

Extend the existing `clips` block; do not add a block kind. A clips block carries
**either** `clips` (one axis, unchanged) **or** `scenarios`:

```ts
export interface CaseStudyClipScenario {
  /** Stable within its block; part of the tab and panel ids. */
  readonly id: string;
  /** What the reader picks: `Avoid`, `Intercept`. Short and parallel. */
  readonly label: string;
  /** Swaps with the scenario. Must carry the synthetic-data sentence. */
  readonly caption: string;
  /** Same views, same ids, same labels, same order in every scenario. */
  readonly clips: readonly [CaseStudyClip, ...CaseStudyClip[]];
}
```

On a scenario block, `title` is fixed across scenarios and is the scenario tablist's
visible accessible name; the per-scenario `caption` replaces the block-level one.
Encode the either/or in the type (a discriminated union on the presence of
`scenarios`), so a block cannot carry both and the template cannot render a scenario
block without a caption.

**View parity is an invariant.** "The view you chose persists across a scenario
switch" is only well-defined if every scenario offers the same views. A unit test
asserts it; the type alone cannot.

`radar-moboard`'s block becomes a scenario block. Its avoid scenario keeps the
existing clip ids (`board`, `seaview`), sources and posters. The intercept scenario
uses the same two ids.

## 5. Component behaviour (`CaseStudyClips`)

- **State is `{ scenarioId, viewId }`.** Defaults: the first scenario, the first view.
  The view choice persists across scenario switches, for the life of the page only.
  No storage.
- **Exactly one `<video>` in the DOM, keyed by the pair** (`${scenarioId}:${viewId}`).
  Every switch unmounts the old element and mounts a fresh one on its own poster, so
  an unchosen clip is never requested, not even for metadata. This is the existing
  load-bearing rule extended to two axes; it is not relaxed.
- **Semantics.**
  - Scenario switch: `role="tablist"` with manual activation, exactly as today's
    switch (arrows move focus, Enter or Space commits).
  - View switch: a `role="group"` of `<button aria-pressed>`. Two tablists pointing at
    one panel is a broken tabs pattern; the view does not change what the panel *is*,
    only the camera.
  - The panel stays labelled by the selected scenario tab.
- **Swaps.** Both switches use the existing 200ms fade-out / swap / fade-in. It must be
  **cancellable**: a second choice mid-fade replaces the pending target, and the
  component lands on the last choice made. Correctness must never depend on a
  `transitionend`. Playback after a swap behaves exactly as today's view switch does;
  scenario switches add no new playback rule.
- **Reduced motion and WCAG 2.2.2** handling are unchanged: poster held, playback as
  opt-in, pause control present.
- **Single-axis blocks render exactly as before.** A `clips` block without
  `scenarios` shows one switch (or none, with one clip).

Read the existing comments in `src/lib/caseStudies.ts` and `CaseStudyClips.tsx`
before changing either; several constraints there are load-bearing (equal-width
columns, manual activation, the keyed element).

## 6. Media

| file | from | notes |
|---|---|---|
| `public/video/radar-moboard-intercept-board.mp4` | `capture/out-intercept/board.mp4` | 11.04 s |
| `public/video/radar-moboard-intercept-seaview.mp4` | `capture/out-intercept/seaview.mp4` | 11.36 s; holds where the hulls meet while the clock runs on to T |
| `…-intercept-board-poster.png`, `…-intercept-seaview-poster.png` | first frame of each clip | the clip's OWN first frame, as the existing posters are |

Both clips already match the shipped pair: H.264 High, yuv420p, 600×600, 25 fps,
captured at 0.5× by `capture/radar-intercept.mjs`, libx264 CRF 23. Ship them as
encoded; re-encode only if a check fails. `capture/` is gitignored and exists only on
Omar's machine.

The intercept clips run the app's **intercept demo**, a different encounter from the
shared avoidance scenario. No copy claims the two scenarios share a run.

## 7. Tests

**Unit, `src/lib/__tests__/caseStudies.test.ts`:**
- every scenario in a scenario block offers the same view ids and labels, in order;
- every clip `src` and `poster` exists under `public/`;
- scenario and view labels within a switch are non-empty and unique.

**e2e, `tests/e2e/case-study-content.spec.ts`:**
- the synthetic sentence is asserted on **every scenario's caption**, not only on the
  block (a scenario caption without it must fail the suite);
- "only radar-moboard ships clips" is updated to the four clips in one block;
- the new strings render: the three stats, both Impact paragraphs, `44 of them`.

**e2e, new player spec:**
- exactly one `<video>` in the DOM through all four combinations;
- the chosen view persists across a scenario switch;
- no network request is ever made for a clip that was not chosen;
- roles and keyboard: tablist with manual activation, `aria-pressed` on the view
  buttons, focus order scenario → view → transport;
- rapid alternating clicks across both switches settle on the final choice, with the
  matching `src`, poster and caption;
- the caption swaps with the scenario.

**Existing coverage that must stay green:** `a11y.spec.ts` (axe, both themes),
`reduced-motion-hydration.spec.ts`, `theme.spec.ts`, `projects-filter.spec.ts`.

**Before commit:** `npm run build` (the only typecheck), `npm run test:run`,
`npm run test:e2e`, `npm run lint`, with stray `next dev` / `wrangler` processes
killed first (`docs/ENGINEERING-NOTES.md` §8, §9).

**Before Omar's sign-off:** a real-device check of switching, persistence, swap
motion and touch targets on `npm run preview -- --ip 0.0.0.0`, never on `dev`
(`docs/ENGINEERING-NOTES.md` §7).

## 8. Out of scope

- The radar-moboard repository's README, which does not mention the intercept yet.
  It is Omar's repository.
- The catalog `tagline`, deliberately kept (it is also the meta description; see
  COPY §7.5).
- Any other case study's media.
