# coast-guard-pilot-tracker — LOCKED COPY (W2, drafted 2026-08-31)

**This copy is LOCKED VERBATIM on Omar's approval**, with the same status as the
Nahtadi COPY-LOCKED rows and the two workshop files beside it. Every row is ruled
line by line before any B-task touches it.

- **Lift these strings mechanically.** Every row is a *value*: write it exactly.
  No re-phrasing, no "while I'm in here" improvements, nothing restored from §6.
- Sitewide copy law is satisfied and verified: no em dashes, no AI cadence,
  canonical facts only, skills-defensibility applied to A6.
- **VOLUNTEER TRUTH IS LOAD-BEARING.** Both Coast Guard roles are unpaid. No
  string below implies paid employment, and B9 ¶2 says so outright.
- **Guardrail satisfied.** Nothing published here comes from the real roster.
  See §3 for how that was enforced rather than merely intended.

Scope: the `coast-guard-pilot-tracker` entry (§1), its case study (§2), and the
assets (§3). **The tier flip is NOT part of this file's delivery**; see §5.

---

## §0 — Six rulings, made before writing a word of copy

### 0.1 The two ratios are BOTH TRUE and measure different things

W2's first draft called these a contradiction. That was wrong, and Omar has
confirmed what each one measures:

| figure | what it measures |
|---|---|
| **over a week to 3 minutes** | generating the currency report itself |
| **6 weeks to 2 days** | creating the flight schedule, wall to wall |

The report is an input to the schedule, so the two are sequential, not rival
accounts of one thing. Both are publishable **provided each states what it
measures.** A bare "six weeks to two days" attached to the report would be
wrong; so would a bare "three minutes" attached to the schedule.

`projects.json` states the first as "one week to 3 minutes". **Publish "over a
week"**: Omar's own account is "more than a week for sure", and a precise figure
would overstate the certainty. The résumé's "6 weeks to 2 days" is verbatim and
stands as written, against the schedule.

**Ruling: publish both, each labelled.** B3 and B4 carry one apiece and say so;
A5 spells out both. The framing that treated them as a contradiction is struck.

### 0.2 Both headline claims survive, and one is corroborated twice

| claim | source | verdict |
|---|---|---|
| 6 weeks to 2 days | résumé, Experience | **verbatim** |
| adopted at every U.S. Coast Guard air station | résumé, Experience | **verbatim** |
| fleetwide spread | medal citation: "Citation credits a training records program that spread fleetwide" | **independent second source** |
| Commandant-awarded medal, Mar. 2023 | résumé, Leadership and Awards | **verbatim** |
| sole maintenance responsibility since 2022 | résumé, Experience | **verbatim** |

The adoption claim is the one a reader is most likely to doubt, and it is the one
with two independent sources: the experience bullet and the award citation.

### 0.3 The report's palette is SIX colours, not three

`xl/styles.xml` holds three fills, and stopping there would have produced a
report missing half its colour language. The other three are never saved to the
workbook at all: `ColorReport` writes them at runtime with `Interior.Color`.

| colour | where it comes from | what it means |
|---|---|---|
| `#C41612` red, white text | styles.xml | expired, 0 days left |
| `#FFD44B` amber | styles.xml | 10 days or fewer |
| `#FAF400` yellow | styles.xml | 45 days or fewer |
| `#FFEB9C` pale | **VBA only** | recency, first band |
| `#F4B084` orange | **VBA only** | recency, second band |
| `#FFC7CE` pink | **VBA only** | recency, worst band |

**Ruling: the rebuilt report uses all six**, transcribed from the VBA rather than
inferred from the saved styles.

### 0.4 The two "10 days or fewer" bands are DIFFERENT colours, and that is faithful

Column E (Must Fly By, a 30-day currency) paints **yellow** at 10 days or fewer.
Columns F through M paint **amber** at the same threshold. Nothing in the macro
reconciles them.

It reads like an inconsistency and it would have been easy to normalise. **Ruling:
reproduce it exactly.** The screenshots are evidence of a real tool, and quietly
tidying its output would make them evidence of something else.

### 0.5 One genuine defect in the source, found and deliberately NOT published

`ColorReport`'s final `Else` branch handles a pilot whose designation is outside
classes 1 to 3. Its worst band is inverted:

```
If row_value >= 60 Then ... = RGB(255, 235, 156)   ' pale, the MILDEST colour
```

Every other branch escalates to pink at its worst band. Here the most overdue
state paints the calmest colour.

**Ruling: this stays out of the published copy, and Omar should fix it in the
source.** Two reasons for the silence. It is an unreached fallback in practice,
since every pilot carries a designation; and a public case-study page is not the
right place to disclose a defect in a tool that is in daily fleetwide use. That is
a different judgement from `radar-moboard`, where the buggy version was
superseded and retired, so naming the bug cost nothing and bought credibility.

### 0.6 The award's name is wrong in the live catalog, in two fields

The decoration is the **Coast Guard Auxiliary Achievement Medal**. `projects.json`
has it right in `description` and wrong in the two fields that actually render on
a card:

| field | live value | correct |
|---|---|---|
| `cardStat` | `USCG Achievement Medal` | `Auxiliary Achievement Medal` |
| `stats` | `Fleet-wide deployment • USCG Achievement Medal` | see A9 |

These are not the same award. The Coast Guard Achievement Medal and the Coast
Guard **Auxiliary** Achievement Medal are separate decorations, and the one named
on the card today is the more senior of the two. Dropping "Auxiliary" claims a
decoration Omar was not awarded, on the surface a recruiter reads first.

**Ruling: never abbreviate in a way that drops "Auxiliary."** A4 and A9 are fixed
below. The résumé is the source and says "Coast Guard Auxiliary Achievement
Medal, awarded by the Commandant of the U.S. Coast Guard, Mar. 2023".

---

## §1 — Catalog entry (`src/data/projects.json`)

| # | Field | LOCKED value |
|---|---|---|
| A1 | `id` | `coast-guard-pilot-tracker` |
| A2 | `title` | `CG Pilot Training Tracker` |
| A3 | `tagline` | `A training-data report adopted at every Coast Guard air station. Over a week of compiling became three minutes.` |
| A4 | `cardStat` | `Auxiliary Achievement Medal` |
| A5 | `description` | `A reporting tool for Coast Guard aviation training currency, built in Python and VBA. It consolidates three exports into one graded sheet: nine qualification currencies and eight recency counters per pilot, each colour-graded against its own interval. Compiling the report went from over a week to three minutes, and building the flight schedule on top of it went from six weeks to two days. Adopted at every U.S. Coast Guard air station and still in daily use. Unpaid volunteer work.` |
| A6 | `technologies` | `["Python", "VBA", "Excel", "pandas", "numpy"]` |
| A7 | `keywords` | `["aviation", "automation", "reporting", "spreadsheet", "currency"]` |
| A8 | `tier` / `featured` / `private` / `org` | `showcase` / `false` / `true` / `USCG` |
| A9 | `stats` | `Report in 3 minutes • fleetwide • Auxiliary Achievement Medal` |
| A10 | `category` | `data-tools` |
| A11 | `imageAlt` | unchanged: `Illustration of a Coast Guard helicopter flying over ocean waves at sunset, representing the Pilot Training Tracker` |
| A12 | `links` | `{}` (unchanged; no public repository exists) |
| A13 | `brand.gradient` | unchanged: `{ "from": "#F97316", "to": "#2563EB" }` |

**A6 keeps Excel and VBA deliberately.** `.claude/CLAUDE.md` demotes them from
any *skills list*, and explicitly permits them inside a real project's tech list.
This is that case.

**A8's `org` is already correct** and needs no change: this project is genuinely
USCG work, which is what the badge now says since the org was decoupled from the
privacy flag.

---

## §2 — Case study (`src/lib/caseStudies.ts`, key `'coast-guard-pilot-tracker'`)

| # | Slot | LOCKED value |
|---|---|---|
| B1 | `hero` | `{ from: '#17395C', to: '#0A1D30' }` |
| B2 | `thesis` | `Compiling aircrew flight currency took over a week by hand. One graded sheet does it in three minutes.` |
| B3 | stat 1 | value `3 minutes` · label `to compile a report that took over a week` |
| B4 | stat 2 | value `6 weeks to 2 days` · label `to build the flight schedule, wall to wall` |
| B5 | stat 3 | value `Fleetwide` · label `every U.S. Coast Guard air station` |
| B6 | tech chips | renders from A6: `Python · VBA · Excel · pandas · numpy` |

**B1 chosen from measurement.** The artwork is 65% orange (hue 10 to 29) and 28%
blue (hue 210 to 219). Orange cannot carry white display type, so the hero takes
the artwork's own second band: `#17395C` at hue 210 carries white at **11.82:1**
and separates from the orange squircle at **4.22:1**.

**B3 and B4 each say what they measure**, per §0.1. Neither figure is publishable
bare. The seventeen checks the copy refers to are counted from the artifact, not
estimated: nine date-based currency columns (E to M) and eight recency counters
(N to U).

### B7 — THE PROBLEM
**eyebrow:** `THE PROBLEM`
**heading:** `Currency lived in three places and agreed in none.`

**¶1** (no emphasis runs)
> Aircrew flight qualifications expire. Each one runs on its own clock, some every 30 days, some every 90, most annually, and a lapsed qualification grounds the aircrew until it is renewed. Knowing who is close to the edge meant pulling three separate exports, the flight logbook, the simulator logbook and the designations list, and cross-referencing them by hand.

**¶2** (emphasis run: `over a week`)
> Done properly for a whole air station, compiling that picture took **over a week**, and the flight schedule built on top of it took six weeks wall to wall. Long enough that the answer had aged by the time it arrived, which is the failure mode that matters: a currency report nobody can produce often enough is a currency report nobody trusts.

### B8 — THE APPROACH
**eyebrow:** `THE APPROACH`
**heading:** `Three exports in, one graded sheet out.`

**¶1** (emphasis run: `sole author and sole maintainer`)
> I am its **sole author and sole maintainer**. I wrote it in Python and later VBA so it would run inside the Excel the unit already had. Two officers at USCG Sector San Diego shaped it as domain stakeholders: they explained the manual process it replaced, defined what each qualification and interval actually meant, and reviewed every iteration of the output. The requirements came from the people who had been doing it by hand.

**¶2** (no emphasis runs)
> A run takes three CSV exports, loads each into a temporary sheet, matches pilots across all three, computes every interval against the report date, writes one row per pilot grouped by designation class, and deletes the temporary sheets behind it. Nine qualification dates and eight recency counters per pilot, on one sheet, in one pass.

**¶3** (emphasis run: `no formulas and no conditional formatting`)
> The finished sheet contains **no formulas and no conditional formatting**. The macro writes values and paints fills directly, which is a deliberate choice rather than an omission: the output is a fixed artifact of the moment it was run, and it cannot silently recalculate into a different answer on a different machine on a different day. The thresholds live in the code, where they can be read and reasoned about, and they are not uniform: a pilot's designation class decides how many days count as overdue.

### B9 — THE IMPACT
**eyebrow:** `THE IMPACT`
**heading:** `Two days, at every air station.`

**¶1** (emphasis run: `every U.S. Coast Guard air station`)
> The report now takes three minutes to generate instead of over a week, and the flight schedule it feeds went from six weeks to two days end to end. It was adopted at **every U.S. Coast Guard air station** and is still in daily use. The work was recognised with the Coast Guard Auxiliary Achievement Medal, awarded by the Commandant of the U.S. Coast Guard in March 2023; the citation credits a training records program that spread fleetwide.

**¶2** (emphasis run: `unpaid volunteer work`)
> All of it is **unpaid volunteer work**. I have been a Coast Guard Auxiliary volunteer since 2015 and have written software for Sector San Diego since 2022, a role that did not exist until I created it, and I have been its only maintainer since.

**¶3** (no emphasis runs)
> A second tool for the same Sector, a parts inventory system and database, cut helicopter parts search time by roughly 85 percent. It stays a card on this site rather than a case study, for the honest reason that there is nothing about it that can be shown.

---

## §3 — Assets

### The synthetic workbook, and how the roster was kept out

**Ten synthetic pilots.** Surnames are NATO phonetic-alphabet words, which are
provably not personnel names, and the spread was designed to exercise every one
of the six colour bands rather than to resemble any real unit's state. Report
date 31 Aug 2026. Coverage as built: 19 pale, 17 orange, 15 yellow, 5 red, 4
pink, 2 amber.

**The real roster was never read.** This is enforced, not merely intended:

- `Sheet3` is the roster. It was identified from `workbook.xml`, and
  `worksheets/sheet2.xml` was **deleted from the working copy before anything
  else ran**.
- `sharedStrings.xml` pools strings from both sheets, so resolving it wholesale
  would have exposed roster names. Only the 34 indices the Report sheet actually
  references were ever resolved.
- The build deletes `Sheet3` as its first action and asserts the workbook holds
  exactly one sheet before writing anything.
- **Verified with a control.** The two officers' surnames appear in 1 file each
  in the original unpack and in **0 files** in the saved workbook. The saved file
  has no `sharedStrings.xml` at all and exactly one worksheet.
- The Report sheet itself held no personnel data: rows 6 to 25 were empty and
  rows 26 to 31 held only `-` placeholders.

**The workbook never enters the repo**, and neither does the extracted VBA. Both
live only in the session scratchpad.

### The credit block, rewritten

Row 3 carried three real entries. LOCKED replacement:

> `• LT A. Rivera (USCG Air Station A)`
> `• LT M. Calloway (USCG Air Station B)`
> `• Omar Younis (USCG Auxiliary)`

Two officers replaced with synthetic names and generic units; Omar's own entry
kept, flotilla number dropped. **"USCG Sector San Diego" is canonical and stays
in the prose** (B8 ¶1); the generic Air Station A/B labels belong to the
synthetic dataset only, and the two must not be mixed.

### Captures, approved and committed

Omar approved the dataset and the look, then exported from the synthetic workbook.
**Both are cut from a vector PDF export, not a screen capture**, so there is no
scaling or compression artifact in either.

| file | size | what it is |
|---|---|---|
| `tracker-report.png` | 2518x390 | the full 28-column report at 300 DPI |
| `tracker-detail.png` | 2308x582 | 600 DPI cut of the pilots and check-due columns, showing the colour bands |

### The media slot

| # | file | role |
|---|---|---|
| F1 | `figure-report.png` | **the media slot.** 1280x720, authored at exactly 16:9 |

Caption, LOCKED:

> `The report the macro writes, on a synthetic roster. All pilots, dates and values are invented.`

**Stacked, not side by side.** The two captures are 6.46:1 and 3.97:1. Placing
them in a row would have forced one down to illegibility, so the wide overview
sits above and the detail below: the overview carries the shape of the thing,
28 columns wide, and the detail carries the colour language at a size a reader
can actually read.

### The flow diagram

| file | role |
|---|---|
| `flow-light.png` / `flow-light.svg` | light theme, 1280x720 |
| `flow-dark.png` / `flow-dark.svg` | dark theme, 1280x720 |

Both authored at exactly 16:9 because `.case-figure-media` sets
`object-fit: cover` and crops anything else. Content is taken from the macro's
own control flow: three CSV imports, one consolidation step, one report sheet,
with the temporary sheets deleted after each run. Type is **architecture**, not
the skill's data-flow grammar, which is role-parametric and over-engineered for
five nodes.

**Skinned to the site, not to the skill's default palette.** The diagram-design
style guide was at its shipped defaults with no project marker; rather than pause
on that gate, it was skinned from the repo's own tokens, since "site-consistent"
already answered the question. Roboto replaces the skill's Geist and Instrument
Serif for the same reason.

**The template has ONE media slot.** F1 and the flow diagram cannot both occupy
it. That choice belongs to B-B, and §5 records it as open.

### Apple-calibration and both-theme check: DONE on both figures

Measured, not eyeballed.

The composite's own type, on its white ground:

| element | ratio | floor |
|---|---:|---|
| eyebrow and panel labels 12px `#6e6e73` | 5.07 | 4.50 |
| title 24px `#1d1d1f` | 16.83 | 3.00 |
| panel frame `#d2d2d7` | 1.51 | UI only |

The flow diagram, every element, both themes:

| element | light | dark | floor |
|---|---:|---:|---|
| title 28px | 16.28 | 19.13 | 3.00 |
| node name 16px on card | 16.83 | 17.17 | 4.50 |
| sublabel 11px on card | 5.07 | 8.35 | 4.50 |
| eyebrow and legend 11px | 4.91 | 9.30 | 4.50 |
| accent arrow label 9px | 4.54 | 8.54 | 4.50 |

Both figures were rendered inside the real `.case-figure` frame, above the real
caption bar, on both page grounds. The white spreadsheet panel on the dark page
is the correct treatment for a document capture and was checked by eye as well as
by number.

The light accent sits at 4.54, which is the site's own `#0071e3` on its page
ground and the figure `.claude/CLAUDE.md` already records. It clears AA with no
margin to spare, so do not darken the ground it sits on.

**One value is not ours to change and is recorded rather than fixed:** white on
the workbook's expired red `#C41612` measures 6.05, which passes, but the
workbook's own yellow and amber bands carry black text at ratios Excel chose. The
captures are evidence of a real tool; its palette is reproduced, not corrected.

---

## §4 — Rulings carried

1. **Never paid employment.** Both roles are unpaid volunteer work; B9 ¶2 states
   it in those words and no other string softens it.
2. **Authorship is exact, and neither half may be dropped.** Omar is sole author
   and sole maintainer of the software. Two USCG Sector San Diego officers
   contributed as domain stakeholders, explaining the manual process, defining
   terminology, and reviewing each iteration. B8 ¶1 carries both. Do not imply
   co-authorship, and do not erase the contribution: requirements elicitation from
   the people doing the job by hand is a strength, not a footnote.
3. **The inventory system stays a card**, acknowledged in one line (B9 ¶3) with
   the honest reason.
4. **Sheet3 and the Desktop CSVs were out of scope and stayed out.** The CSVs were
   never opened.
5. **Stats rows use ledgered numbers only.** B3 and B4 are résumé-verbatim; B5 is
   counted from the Report sheet's own columns.
6. **FIRST PERSON, sitewide.** `/about` is written in the first person and the case
   studies follow it. Omar is never referred to in the third person in visitor-facing
   copy. Applied to B8 ¶1 and B9 ¶2 in B-B after review. This is a rule about
   self-reference only: impersonal prose about a system ("the macro writes values
   and paints fills directly") is correct and must not be rewritten into "I" for
   its own sake.

---

## §5 — Open, and explicitly NOT decided here

- ~~Which figure takes the one media slot.~~ **DECIDED in B-B: `figure-report.png`.**
  The report is the artifact the case study is about, and the flow is already
  carried by B8 ¶2's prose. `flow-light.png` / `flow-dark.png` stay committed here
  as an unused asset rather than being deleted: they are calibrated, both-theme,
  and the obvious source if the template ever grows a second media slot.
- ~~Omar approves the dataset and the look~~ **DONE.** Approved, exported from a
  vector PDF, and committed.
- **The tier flip is a separate commit, and B-A's amendment says why.** Flipping
  this project to `showcase` without its `caseStudies.ts` entry in the same
  commit throws at prerender. The task after this one lands §1 and §2 together.
- **The `Else`-branch defect in `ColorReport`** (§0.5). Omar's to fix in the
  source; deliberately absent from published copy.
- **The screenshots' captions** are not written here. They follow the same rule
  as `radar-moboard`: every visual carrying a scenario says the scenario is
  synthetic.
- **The plan names this file `pilot-tracker-COPY.md`.** It is
  `coast-guard-pilot-tracker-COPY.md`, matching the project id and the two files
  beside it.

---

## §6 — Struck, do not restore

- The framing that treated the two ratios as a contradiction. Both are true and
  measure different things. See §0.1.
- Either figure published BARE. "Over a week to three minutes" belongs to the
  report; "six weeks to two days" belongs to the flight schedule. Each must say
  which, every time.
- `one week to 3 minutes` as a precise claim. Omar's account is "more than a week
  for sure", so publish "over a week".
- `USCG Achievement Medal` in `cardStat` or `stats`. That is a different and more
  senior decoration. Never abbreviate in a way that drops "Auxiliary". See §0.6.
- Any wording that lets either Coast Guard role read as paid employment.
- Any real name, rank, unit, flotilla number, or roster value.
- Normalising column E's yellow to match F through M's amber. See §0.4.
- The `ColorReport` `Else`-branch defect, as published copy. See §0.5.
