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

## §0 — Three rulings, made before writing a word of copy

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

**¶3** (emphasis run: `the fixture is what gets questioned first`)
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

## §3 — Visuals: specified and captioned, NOT YET STAGED

**Nothing is staged.** `docs/superpowers/content/radar-moboard/` does not exist and
no captures have been supplied. The captions and slots below are locked; the files
are outstanding from Omar. **No B-task may proceed on this section until they land.**

Every capture must be **synthetic by construction**: a published training problem or
an invented scenario, never a real track. Per audit D.6 the scenario should use the
same default parameters as the retired public app so the two read as one scenario.

| slot | file | caption (LOCKED) |
|---|---|---|
| V1 media slot | `radar-moboard/board.png` | `The maneuvering board, worked. All scenarios synthetic.` |
| V2 media slot | `radar-moboard/sea-view.png` | `The same problem in the tilted sea view. All scenarios synthetic.` |
| V3 origin | `radar-moboard/prototype.png` | `The Python prototype it replaces. All scenarios synthetic.` |

### Two structural problems B-B cannot solve on its own

**1. The template has exactly ONE media slot, and there is no origin-chapter slot.**
`CaseStudyFigure` is a single optional object and the template renders one 16:9
figure between THE APPROACH and THE IMPACT. The plan asks for a GIF in the media
slot *and* a prototype screenshot in the origin chapter; the second placement does
not exist, and the case-study template is explicitly out of scope for redesign.
**Recommendation: one composite 16:9 figure** carrying the board and the sea view
side by side, with the prototype screenshot either inset small or dropped. This is a
content decision, not a template change. Omar's call.

**2. An animated GIF is not safe in that slot.** The figure renders through
`next/image`, and in production `src/lib/imagekitLoader.ts` rewrites every non-SVG
source to `tr:w-…,q-75,f-auto`. Animation surviving that transform is not something
this repo has ever tested, and `unoptimized` would be a template change. **Recommend
a still composite for the media slot** and, if the animation matters, treating it as
a separate decision rather than assuming the GIF will play.

---

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

---

## §5 — Open, and explicitly NOT decided here

- **All three visuals.** Outstanding from Omar. See §3.
- **The composite-versus-single figure decision**, and whether the animation is
  pursued at all given the loader constraint.
- **The `USCG · PRIVATE` badge on this entry** (A8), which follows from marking it
  private and today appears only on the two Coast Guard entries.
- **A2's title.** `Radar Plotting Trainer` is proposed over the retired entry's
  `Maritime Collision Avoidance`, which described the domain rather than the
  artifact. The résumé calls it a "collision avoidance plotting trainer"; that full
  phrase is 35 characters and long for a card.
- **The résumé's 12-problem line** (§0.1), which understates the corpus by four.
- **The repository README's stale Status section** (§0.5).
- **Apple-calibration on the fitted page** is only partly done. B1's contrast and
  every string length in §1 and §2 are measured against the template's real CSS.
  The both-theme check on the assembled page cannot run until the visuals land and
  B-B wires the entry, and it remains a gate before Omar's page review.

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
