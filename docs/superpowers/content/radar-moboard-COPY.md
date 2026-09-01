# radar-moboard — LOCKED COPY (W1, drafted 2026-08-30)

**This copy is LOCKED VERBATIM on Omar's approval.** It carries the same status as
About's locked copy, the Nahtadi COPY-LOCKED rows, and W3's a16 file: every string
below is ruled line by line before any B-task touches it.

- **B-A and B-B lift these strings mechanically.** Every row is a *value*: write it
  exactly as it appears. No re-phrasing, no "while I'm in here" improvements, no
  restoring anything from §6.
- **If a layout cannot hold a line, raise it with Omar.** The strings do not shrink
  to fit a layout.
- Sitewide copy law is satisfied and verified: no em dashes, no AI cadence, canonical
  facts only, skills-defensibility applied to A6.
- **Guardrail satisfied: nothing below is operational.** No real vessel identity, no
  unit name, no workflow, no scenario. Every problem named is a published training
  exercise. Copy is pre-negotiation silent: no commercial, licensing or partnership
  posture anywhere, and no live-demo language in any slot.

Scope: the `radar-moboard` entry in `src/data/projects.json` (§1), its entry in
`src/lib/caseStudies.ts` (§2), and the visual slots (§3). **B-A owns the catalog
swap and the redirect; this file only specifies the values.**

---

## §0 — Six rulings, made before writing a word of copy

The plan handed this task three ledgered stats. **Two did not survive contact with
the repositories.** Same failure mode W3 found: figures that were written down once
and then drifted from the artifact.

### 0.1 "12-problem verification corpus" is wrong. The corpus is SIXTEEN.

The résumé says "two independent answer keys across a 12-problem corpus of worked
radar plots." Counted directly in the fixtures:

| fixture | problems | status |
|---|---:|---|
| `fixtures/pub217_problems.json` | **6** | public. Pub. 217 Maneuvering Board Manual, 4th ed. 1984, NIMA. US Government work, no copyright claimed. |
| `fixtures/private/rtps_problems.json` | **10** | a third party's answer key, withheld for redistribution permission, not secrecy |
| **total corpus** | **16** | across two independent keys |

**Where 12 comes from:** `docs/GEOMETRY.md:692` reads "all twelve maneuver problems
in the corpus." Twelve is the **maneuver subset**, counted and confirmed: 12 of the
16 problems require a course or speed change. The résumé collapsed the subset into
the whole and understated the corpus by four problems.

**Ruling: publish 16, described as the corpus.** The résumé line needs the same
correction the ROUGE line needed. Omar's to make.

### 0.2 "+3D views vs the prototype" is directionally right and imprecisely named.

Verified in `packages/render`: there are **two** view modes, not a 3D mode bolted on
to a 2D one. The board view is a top-down plotting sheet held at `tiltDeg` 90. The
sea view is a tilted perspective with an `eyeDistanceNm`, driven by a tilt schedule
(`tilt.ts`, `sea.ts`, `mat3.ts`), and `view-mode.ts` eases between them while the
clock keeps running.

The prototype has neither. `src/radar_plotter/plotting/animation.py` in the public
repo is a **0-byte stub**, so the claim that the rewrite adds animation is exact.

**Ruling: do not use the phrase "3D views" as a stat.** The repo's own word is the
sea view, and "two views, one of them tilted, with playback" is both truer and more
interesting than a dimension count. It moves to prose in B9, and the third stat slot
goes to a number that is unambiguous.

### 0.3 "Two weeks to port" survives, and is better stated as 12 days.

`git log`: first commit 2026-08-06, last 2026-08-18, 276 commits, no branch outside
that window. **12 days.** The résumé says "in under two weeks," which is true.
Twelve days is the same fact, stated tighter, and it is the figure below.

### 0.4 One number that needed splitting before it could be published

The test suite reports two different totals depending on whether the withheld key is
present, and publishing either without saying which would be the 828-vs-847 mistake
again:

| run | tests | context |
|---|---:|---|
| full local, both keys present | **1,589 passed, 9 skipped** | what the project actually runs |
| public fixture only | **806 passed, 20 skipped** | what CI enforces, since `fixtures/private/` is gitignored |

Both measured by running `npm test`, the second with the private fixtures moved
aside and restored afterwards. **B5 publishes 1,589 and its label says "both answer
keys,"** which is the honest form. Do not write 1,589 next to the word CI.

### 0.5 The repository's own README understates the project, and is not the source

`README.md` still says "Early. The geometry is not implemented yet ... the test suite
is red by design." That text dates from the 2026-08-06 scaffold; the suite is now
1,589 green and `packages/geometry/src/index.ts` exports the full pipeline through
`maneuver.solve()` and `grade`. **The copy below describes the code and the passing
suite, not the README.** Omar may want to refresh that Status section; it is not a
site task.

### 0.6 The two implementations agree on the shared scenario, and ONLY on it

Verified here rather than taken on trust: the nine values were read off
`prototype-ui.png`, then radar-moboard's own `solve()` was run on the same inputs
from `packages/geometry/dist`. They agree on every one.

| reported value | prototype | radar-moboard `solve()` | published |
|---|---|---|---|
| CPA range | 1.4 NM | 1.4305 nm | 1.4 nm |
| CPA bearing | 322.15° | 322.1455° | 322° |
| time of CPA | 14:27 | 14:06 plus 21.11 min | 14:27 |
| SRM | 25.3 kts | 25.2509 kt | 25.3 kt |
| DRM | 232.15° | 232.1455° | 232° |
| STM | 20.7 kts | 20.6809 kt | 20.7 kt |
| DTM | 254.59° | 254.5899° | 255° |
| new course | 046.50° | 46.4965° | 046° |
| new speed | 3.6 kts | 3.5817 kt | 3.6 kt |

They do not merely round to the same display values; the underlying floats match to
four decimal places, which is two independent implementations doing the same
arithmetic. `moboard-ui.png` corroborates five of the nine on screen (DRM 232, CPA
1.4 nm, 21 min, DTM 255, STM 20.7); the other four are cropped out of that capture,
which is why the solver was run rather than the panel squinted at.

**This is agreement on ONE scenario and must never be published as general
agreement.** Own ship steers 000 here, which is the single heading the prototype's
frame-of-reference defect cannot affect: with own course at 000 the head-up frame
and true north coincide, so the bug B7 ¶2 describes has nothing to bite on. Change
own course and the two would be expected to diverge.

**Ruling: publish it as corroboration, never as the verification claim.** The
16-problem corpus against two independent answer keys (§0.1) remains primary. This
is a second, weaker witness that happens to be visible in a picture.

---

## §1 — Catalog entry (`src/data/projects.json`), specified for B-A

| # | Field | LOCKED value |
|---|---|---|
| A1 | `id` | `radar-moboard` |
| A2 | `title` | `Radar Plotting Trainer` |
| A3 | `tagline` (106 ch) | `A maneuvering board that grades your plot, from two radar observations to the maneuver that opens the CPA.` |
| A4 | `cardStat` | `1,589 tests` |
| A5 | `description` | `A trainer for maneuvering board problems, rebuilt from a Python prototype as a four-package TypeScript monorepo in 12 days. Enter two radar observations, own ship's course and speed, and a required CPA; it returns the contact's true course and speed, the closest point of approach and time to it, and the course or speed change that opens the CPA to the distance required. Graded in CI against two independent answer keys.` |
| A6 | `technologies` | `["TypeScript", "React", "SVG", "Node", "Vitest"]` |
| A7 | `keywords` | `["collision avoidance", "navigation", "marine", "radar", "maneuvering board"]` |
| A8 | `tier` / `featured` / `private` | `showcase` / `true` / **`true`** |
| A9 | `stats` | `16 problems • two answer keys • 1,589 tests` |
| A10 | `category` | `data-tools` |
| A11 | `imageAlt` | `White and orange drafting dividers standing on a dark blue radar plotting dial with cyan bearing ticks and range rings` |
| A12 | `links` | `{}` |
| A13 | `brand.gradient` | `{ "from": "#0F2A43", "to": "#101F2E" }` (fixed by W4, already in STYLE.md) |
| A14 | `image` | `/images/projects/radar-moboard/card.png` |

**A7 keeps `collision avoidance`** so the merged entry still answers the old search,
per the spec's merge note.

**A8 and A12 are a pair, and they are a change of posture.** The `radar-moboard`
repository is private and stays private. The superseded prototype is public, but
linking it from this entry would point a recruiter at the version this case study
describes as wrong. So the entry carries **no GitHub link at all** and is marked
private, which the Projects contract already has grammar for: a `USCG · PRIVATE`
badge plus the blue `Case study →` action, never a dead link. **Omar should confirm
he is happy with the USCG badge on this entry**, since the badge text is data-driven
off `private: true` and today only the two Coast Guard entries carry it.

**A13 must be mirrored into `src/lib/projectStyles.ts`**; the gradient-sync test
fails if the two drift.

---

## §2 — Case study (`src/lib/caseStudies.ts`, key `'radar-moboard'`)

| # | Slot | LOCKED value |
|---|---|---|
| B1 | `hero` | `{ from: '#155E75', to: '#0B2A38' }` |
| B2 | `thesis` | `Paper plots do not check themselves. This one is graded against two independent answer keys.` |
| B3 | stat 1 | value `12 days` · label `Python prototype to TypeScript monorepo` |
| B4 | stat 2 | value `16 problems` · label `graded against two independent answer keys` |
| B5 | stat 3 | value `1,589 tests` · label `green across both answer keys` |
| B6 | tech chips | renders from A6: `TypeScript · React · SVG · Node · Vitest` |

**B1 chosen from measurement.** The artwork's saturated pixels sit 86% inside hue
180 to 215 (cyan and teal-blue), so `#155E75` at hue 194 is drawn from the subject's
own band. It carries white at **7.27:1** against an AA floor of 4.50 for normal text,
and separates from the `#0F2A43` squircle at 2.02:1, which the hero icon's own
`drop-shadow` reinforces. The card gradient is fixed by W4 and is too dark to serve
as a hero behind white display type.

### B7 — THE PROBLEM
**eyebrow:** `THE PROBLEM`
**heading:** `Paper does not tell you when you are wrong.`

**¶1** (no emphasis runs)
> Deck licence candidates work maneuvering board problems by hand, on a paper plotting sheet, under examination conditions. The construction is unforgiving and the feedback arrives at the end: one vector laid off a degree wide carries through every step after it, and the mistake only shows up when the final answer misses.

**¶2** (emphasis run: `certain valid inputs plotted wrongly`)
> An earlier Python version of this got the method right and the frame of reference wrong. It drew the board head up, with own ship's course sitting at 000, and recovered the true course by adding that course back at the very end. That is a legitimate way to work a relative plot on paper. On a screen it means the bearings drawn are relative rather than true, so **certain valid inputs plotted wrongly**, and nothing in the app said so.

### B8 — THE APPROACH
**eyebrow:** `THE APPROACH`
**heading:** `Rebuild it in TypeScript, and let the answer keys decide.`

**¶1** (emphasis run: `12 days`)
> The rewrite is a four-package TypeScript monorepo. Geometry holds every construction and knows nothing about a screen, render turns a solved problem into a scene, app is the React front end, and export is the interface for handing a worked sheet back out. The port took **12 days**, and the language was new. Claude Code carried the debugging and refactoring and wrote a tutorial alongside each feature as it landed, 42 of them by the end.

**¶2** (emphasis run: `two independent answer keys`)
> Correctness here is graded, not asserted. The suite runs the solver against **two independent answer keys**: six worked examples from Pub. 217, the United States government maneuvering board manual, and ten problems from a separate training key. Sixteen problems, twelve of which require a maneuver. A branch protection rule blocks any merge to main until the whole suite passes.

**¶3** (emphasis run: `agree on all nine`)
> The retired prototype is a second witness, on one scenario. Run on its own default problem, the two implementations **agree on all nine** reported values, down to the decimals behind the rounding. That is corroboration rather than proof, and worth saying why: own ship steers 000 there, which is the one heading the older frame of reference could not get wrong.

**¶4** (emphasis run: `the fixture is what gets questioned first`)
> Two cases are skipped deliberately, each with its reason written down, and neither is quietly smoothed over. The standing rule when a hand-derived construction disagreed with a key was that **the fixture is what gets questioned first**, then the instrument doing the measuring, then the geometry. One suspected transcription error turned out to be neither: the tolerance had been set without allowing for answers already rounded to the nearest knot.

### B9 — THE IMPACT
**eyebrow:** `THE IMPACT`
**heading:** `It grades the plot, and it shows the motion.`

**¶1** (no emphasis runs)
> Enter two radar observations of a contact, own ship's course and speed, and the closest point of approach you need. It returns the contact's true course and speed, the CPA and the time to it if nobody alters, and the course or speed change that opens the CPA to the distance required. It cites COLREGS Rule 19 for which way the turn should go, and leaves the decision with the mariner.

**¶2** (emphasis run: `a tilted sea view`)
> The board draws two ways. One is the familiar top-down plotting sheet. The other is **a tilted sea view**, and the transition eases between them while the clock keeps running, so the geometry stays continuous rather than cutting. Motion plays back across the run, which lets a trainee watch relative motion develop instead of reading it off a finished sheet. The prototype had neither view and no playback at all.

**¶3** (emphasis run: `a trainer, not a navigation instrument`)
> The modelling is deliberately narrow. It assumes instantaneous course changes, ignores advance and transfer, ignores set and drift, and takes every contact as holding a steady course and speed. It is **a trainer, not a navigation instrument**, and the repository says so in those words.

---

## §3 — Visuals: staged, captioned, and fitted

**Staged and committed** under `docs/superpowers/content/radar-moboard/`. Every
capture is synthetic by construction: all of them run the **shared scenario**, which
is `collision-avoidance-radar`'s own default set, per audit D.6, so the retired app
and the rewrite read as one encounter.

| parameter | value |
|---|---|
| own ship | course 000, 10 kt |
| first observation | bearing 045, 11.5 nm, 14:00 |
| second observation | bearing 043, 9.0 nm, 14:06 |
| required CPA | 2.5 nm |
| maneuver ring Mx | 5.0 nm |

The capture rig that produced them lives at `capture/radar.mjs` in the working copy
and is **gitignored**, along with its raw `capture/out/`. It drives radar-moboard's
dev server through Playwright at a fixed viewport and encodes the scenario above, so
the stills and the video are reproducible rather than hand-framed. It is deliberately
kept out of `tests/e2e/`, whose `webServer` config would otherwise sweep it into
`npm run test:e2e`.

### The media slot

**One composite, per Omar's ruling**, since the template has one media slot and no
origin-chapter slot.

| # | file | role |
|---|---|---|
| F1 | `figure-before-after.png` | **the media slot.** 1280x720, authored at exactly 16:9 |

Caption, LOCKED:

> `The same encounter, worked by both implementations. They agree on all nine reported values. All scenarios synthetic.`

It pairs `prototype-plot.png` beside `moboard-board.png`: same scenario, same
construction, same answer, labelled BEFORE and AFTER, so the upgrade is legible
without the copy having to assert it.

**`moboard-vectors.png` is NOT inset.** At 580px per panel there is no room for a
third element without crowding the two plots that carry the comparison, and the
vector triangle is already visible in both panels. Restraint over completeness.

### The clip block, LOCKED

One video area with the two clips as choices, not one tile each (B-G), on
apple.com/mac's tab pattern (B-H).

| slot | string |
|---|---|
| title, above the chooser | `See the same run from either viewpoint.` |
| tab 1 | `Board view` |
| tab 2 | `Sea view` |
| caption | `The maneuver fires at the Mx ring, and the clock never stops between the two. All scenarios synthetic.` |

**The tab labels must stay short and parallel.** The chooser's columns are equal
width so its indicator can travel by pure `transform`, which means the longest
label sets the width of both. `Maneuvering board` was 17 characters against `Sea
view`'s 8; at 390px it did not fit, the grid stopped honouring equal columns, and
the indicator — still sized to half the track — cut through the word "board".
`Board view` is 10, leaves 40px of slack inside its pill at every width down to
390, and is parallel construction where the old pair was not.

### Staged, not placed

These are committed and available to a later task; none is wired by W1.

| file | what it is |
|---|---|
| `moboard-board.png` | board at t=0, wide. The AFTER panel of F1 |
| `prototype-plot.png` | the retired app's plot. The BEFORE panel of F1 |
| `moboard-vectors.png` | zoomed on the vector triangle, labels legible |
| `moboard-board-cpa.png` | board at CPA, 21 min |
| `moboard-seaview-cpa.png` | sea view at the same instant |
| `moboard-ui.png` | the whole UI. Results panel is cropped at the right edge |
| `prototype-ui.png` | the retired app's whole UI, with its nine readouts |

Any of these that later reaches the page carries the same `All scenarios synthetic.`
marker as F1.

### Apple-calibration and both-theme check: DONE on the fitted figure

- **Authored at exactly 1280x720.** `.case-figure-media` sets `aspect-ratio: 16 / 9`
  with `object-fit: cover`, so any other ratio would be silently cropped. Verified
  1.7778.
- **Both themes rendered and inspected** with the real tokens, inside the real
  `.case-figure` frame (1px `--edge`, 18px radius) and above the real caption bar on
  `--surface-sunken`. It reads as a document panel in both. Caption contrast is the
  template's own tested pairing: **5.44:1** light, **9.42:1** dark.
- **One defect found and fixed by this pass.** The composite's BEFORE/AFTER kicker
  was first set in Apple's `#86868b`, which is **3.62:1 on white and fails AA**. It
  is the exact value `.claude/CLAUDE.md` records as failing on the footer, with
  `#6e6e73` as the approved replacement. Rebuilt at `#6e6e73`, **5.07:1**. Panel
  titles are `#1d1d1f` at 16.83:1.

## §4 — Rulings carried

1. **Embed retired, and the copy is silent on it.** No "live demo", no "try it in the
   browser", no embed URL, in any slot above. The old entry's `cardStat` of
   `Live demo` is struck (§6) and A4 replaces it.
2. **Pre-negotiation silence holds.** Nothing above mentions a demo, a sale, pricing,
   licensing, a partnership, or a prospective customer.
3. **The withheld answer key is described, never identified.** §0 and B8 say a
   separate training key exists and that it is withheld for redistribution
   permission. No author name, no document title, and none of its contents appear
   here or may appear on the page.
4. **Pub. 217 is safe to name.** A United States government work, 4th edition 1984,
   no copyright claimed under Title 17 U.S.C., stated as such in the fixture itself.
5. **The prototype's defect is published deliberately**, per the spec's instruction
   that the case study tell the progression including the 000-heading assumption
   honestly. B7 ¶2 is that sentence.
6. **The vector-triangle tile stays at full tile width. Do not shrink it to set
   text alongside** (ruled by Omar at the B-F review, 2026-08-31; the question was
   asked and answered no).

   That tile exists for one reason: to make `r`, `rc`, `rs` and `NC` legible. In
   the comparison figure the same cluster is about 90px across and its labels are
   unreadable, which is why W1 recorded that a third inset panel was not worth
   building and why B-E built that column and rejected it. The detail block was
   the fix, and it works by size alone: the construction goes from ~90px to
   ~280px at a 970px tile.

   Halving the image for a text column returns exactly what was bought. There is
   no arrangement in which a two-column layout keeps 280px of construction inside
   a 970px tile, so the trade is legibility for prose, and prose is not what the
   block is for.

   **The 19px caption is where the explanation belongs.** It sits directly under
   the figure at the same size and weight as a tile title, and it already carries
   the reading. If more explanation is ever wanted, it goes in the caption or in
   `caseStudies.ts` prose above the block, never in a column beside the figure.

---

## §5 — Open, and explicitly NOT decided here

- ~~**THE TWO VIDEOS ARE CAPTURED AND READY, AND DELIBERATELY NOT WIRED.**~~
  **RESOLVED, and no longer open.** The template change this deferred was made:
  B-E built the video block, B-F re-rendered both clips at 0.5x and shipped them,
  and B-G replaced the two tiles with one video area and a chooser. Everything
  this bullet listed as missing exists — a `<video>`, a poster taken from each
  clip's own first frame, a WCAG 2.2.2 pause control, and reduced-motion handling
  that holds the poster with playback as the opt-in. The clips are now 0.5x, so
  7.76s and 8.00s rather than the 16.8s recorded here. Locked copy for the block
  is in §3.
- **The `USCG · PRIVATE` badge on this entry** (A8), which follows from marking it
  private and today appears only on the two Coast Guard entries.
- **A2's title.** `Radar Plotting Trainer` is proposed over the retired entry's
  `Maritime Collision Avoidance`, which described the domain rather than the
  artifact. The résumé calls it a "collision avoidance plotting trainer"; that full
  phrase is 35 characters and long for a card.
- **The résumé's 12-problem line** (§0.1), which understates the corpus by four.
- **The repository README's stale Status section** (§0.5).
- **Apple-calibration is done for the figure and the copy, not for the assembled
  page.** B1's contrast, every string length in §1 and §2, and the fitted composite
  in both themes are all measured against the template's real CSS and tokens (§3).
  What cannot run until B-B wires the entry is the whole-page pass: heading rhythm
  down the real column, the hero against the real nav, and axe over the built route.
  That remains a gate before Omar's page review.

---

## §6 — Struck, do not restore

- `Live demo` in any stat or card slot, and the `links.embed` Streamlit URL.
- `Launch live demo` on the case-study hero.
- The old impact heading `Try it in the browser. No install, no dataset.`
- `12-problem corpus` as a description of the whole corpus. It is the maneuver
  subset; the corpus is 16.
- `3D views` as a stat or as a phrase. Two views, one of them tilted. See §0.2.
- `1,589 tests` written next to the letters CI. CI runs the public fixture and
  reports 806.
- Any GitHub link on this entry while the repository is private.
