# Nahtadi family — LOCKED COPY (N1, approved 2026-08-28)

**This copy is LOCKED VERBATIM on Omar's approval.** It carries the same status as
About's locked copy (`docs/superpowers/mockups/about/APPROVED.md`, "Copy is LOCKED
VERBATIM"): the wording went through an audit round with Omar and was ruled line by
line. It is not a draft and it is not a starting point.

- **N2 designs around this copy.** Layout accommodates these strings; the strings do
  not shrink to fit a layout. If a design cannot hold a line, raise it with Omar —
  do not trim the line.
- **N3 implements it without re-editing.** Every row below is a *replacement*: find
  the BEFORE string, write the AFTER string. No re-phrasing, no "while I'm in here"
  improvements, no restoring anything from §6 or §7.

Scope: `/nahtadi`, `/nahtadi/privacy`, `/nahtadi/support`, their metadata and JSON-LD,
plus four sitewide description fixes found in the secondary sweep (§5).

## Amendment 1 — 2026-08-28, JSON-LD `offers`

**One row changed after the first lock.** F6 originally removed the `offers` block
from the SoftwareApplication JSON-LD. That was wrong and is struck.

Google's SoftwareApplication rich result requires **name + `offers` +
`aggregateRating` together**. Removing `offers` would not merely drop the price from
search results — it would drop the page out of rich-result eligibility entirely,
**taking the star rating with it**. That is a search regression on the one page whose
SEO must not regress.

The reasoning that a priceless `Offer` is invalid structured data was sound; the ruling
it served was not. The real defect — markup representing content users cannot see — is
now fixed from the other end: **`offers` stays exactly as it is, and the price becomes
visible content.** That also handles the original staleness concern better, because a
visible price is self-correcting: Omar would notice a wrong number on his own page,
where an invisible one can sit wrong indefinitely.

Consequences, all recorded in place below: **A1's locked string is amended** to carry
the amount (§1 — a re-approval, not a silent edit); F6 in §2 is rewritten; the old
removal moves to §7 with its dependency spelled out; §6 gains an exemption for
`offers`; §8's ledger line is corrected. The §3 Last Updated rule also gains a
publication-timing clause.

## Amendment 2 — 2026-08-28, newsletter removed and App Store facts verified

**Three changes, all rulings from Omar.**

**a. The newsletter section is removed entirely.** Omar does not write newsletters,
nobody has ever subscribed, and `EmailSignup.tsx` is the site's **only runtime
third-party dependency** — a client-side POST to `buttondown.com`. (It never violated
`CLAUDE.md`'s literal "no server action, no API route, no runtime secret" claims — it
is client-side and keyless — but the stack section has no line covering outbound
client-side calls at all. See the B6 note in §9.) Removing it deletes
a dead form, a third-party dependency, and a copy-coherence problem in one move: this
page is about to say **"Nothing leaves your device"** (A15) and **"Nahtadi collects
nothing and transmits nothing"** (A16) directly above a form that transmits an email
address to a third party. **Rows A19, A20 and A21 are STRUCK** — they rewrite copy for
a section that will not exist. They move to §7. The deletion is row **H2** in §1.

**b. `appStoreRating.count` goes 8 → 7.** Row **H1** in §1. Three sources disagreed:
App Store Connect reports **9** worldwide, Apple's public lookup API and the US
storefront both report **7** (App Store counts are per-storefront), and
`projects.json` said **8** — a stale snapshot matching neither. The reasoning is
recorded at H1 because 7 looks like the wrong pick without it.

**c. Every hand-maintained App Store fact on these pages was verified against source
on 2026-08-28** — `https://itunes.apple.com/lookup?id=6755970888` plus App Store
Connect. The ledger is §10. Amendment 1's blocking price gate is **closed**: `$3.99`
is confirmed, so A1 ships as written.

## Amendment 3 — 2026-08-28, the `PRIVACY` eyebrow

**One row added. It is NEW COPY, not a replacement, and that is why it is here.**

N2's mockup applies the sitewide section-header pattern — small blue eyebrow plus
statement heading (`docs/superpowers/mockups/home/APPROVED.md`, "Section header
pattern") — to the privacy section, which introduces one word this document did not
contain: **`PRIVACY`**.

It is recorded rather than left in the mockup because a string that ships without a
row here would make this document stop being the single source of truth for
`/nahtadi`, which is its only job. **N3 must not implement the eyebrow on the
strength of the mockup alone; this row is the authority.**

**Why the page gets exactly one eyebrow.** Four of the five section headings are
already **labels** that name their own section — `Why Nahtadi?`, `Everything You
Need for Salat`, `App Preview`, `Frequently Asked Questions` — and About's contract
forbids rendering an eyebrow identical to its heading. Exactly one heading is a
**statement** that does not name its topic: A15's `Nothing leaves your device.`
That is the case the eyebrow pattern exists for, so it gets one and nothing else
on the page does.

**Why `PRIVACY` and not something written.** The eyebrow slot sitewide carries a
one-word category label (`FLAGSHIP`, `WORK`, `PROJECTS`, `CONTACT`), never prose.
`PRIVACY` names the section in the same register and adds no claim — which matters
on this page, where every sentence about data handling is matched to the privacy
policy's own wording.

The row is **A23** in §1.

## Amendment 7 — 2026-08-30, screenshots move to a dated set directory

**Origin:** Omar's production review. Not a copy change — **no locked string moves and
no slot changes meaning.** Recorded here only because §2 above names the screenshot
file paths, and those paths are now the mechanism that keeps the images fresh.

**BEFORE:** `public/images/nahtadi/screenshot-1..6.png`
**AFTER:** `public/images/nahtadi/screenshots/2026-08-29/screenshot-1..6.png`

**The problem this fixes is not visible in any string.** The screenshots are served
with `cache-control: max-age=31536000` — one year. §2 replaced the captures **in
place**, reusing the filenames, so every browser that had already loaded `/nahtadi`
kept the v1.1.0-era images and had no way to learn otherwise until 2027. Observed
exactly that way: ImageKit served the new bytes at every width from two networks and
the deployed HTML was current (the new `Guided Setup` caption rendered), yet Safari,
iPhone Safari and iPhone Chrome all still showed the old screenshots, while opening
the same image directly in a new tab showed the new one.

**The long cache header is correct and must not be shortened.** It is right for
content that never changes at a URL. What was wrong was changing the content at a
fixed URL. The dated directory makes the URL honest.

**THE PROCEDURE, FOR THE NEXT RE-SHOOT — this will happen on every app release.**
Bump `SCREENSHOT_SET` in `src/components/nahtadi/ScreenshotGallery.tsx` to the new
capture date, drop the new files in `public/images/nahtadi/screenshots/<that date>/`,
and leave the previous directory alone. `tests/e2e/nahtadi.spec.ts` asserts the shape
— all six from one dated set, none from the flat legacy path — so a re-shoot dropped
at the old location fails rather than shipping stale.

A **date** rather than the app version, deliberately: captures are sometimes re-taken
without a release (a better crop, a corrected setting), and a version scheme would
silently reuse a URL in exactly that case. A **path** rather than `?v=`, deliberately:
query handling varies by cache layer and these URLs already pass through ImageKit's
transforms; a distinct path is unambiguous everywhere.

**The flat-path files are intentionally still in the repo.** Nothing references them,
but cached HTML might, and a stale image is a better failure than a broken one. They
can be deleted once the old HTML has aged out.

## Amendment 6 — 2026-08-30, the privacy policy names a person, not "Hendaseh"

**Origin:** Omar's production review of the deployed PR, not an audit finding. This
file's scope has never covered the privacy policy's closing attribution line, which
is why five rounds of copy work passed over it.

**Row P1 — LOCKED VERBATIM, applied.**

| # | Type | Location | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| P1 | COPY | `privacy/page.tsx`, closing attribution | `Nahtadi is developed by [Hendaseh]` (link on `Hendaseh`, href `/`) | `Nahtadi is developed by Omar Saed Younis ([hendaseh.com])` — link moves to `hendaseh.com`, href unchanged, sentence gains a full stop |

**This is the F1 defect in another place.** F1 removed "our support team" because there
is no team; "made by Hendaseh" implied an organisation that does not exist. It also
disagreed with the App Store, which names `Omar Saed Younis` as developer.

**But it is NOT a voice fix, and was not treated as one.** In a privacy policy the
named entity is **who is responsible for the data**. Naming `Hendaseh` named a data
controller with no legal existence — the weaker position if anyone ever asked, not the
safer one. Naming a natural person is *more* accurate, and it aligns three surfaces
that disagreed: this line, the support page's Developer row, and the JSON-LD `author`
(which said `Organization` / `Hendaseh` and is now `Person` / `Omar Saed Younis`).

`Omar Saed Younis` rather than the site's `Omar Younis` is **D11's precedent applied
unchanged**: the legal name belongs in the places legal responsibility is named, and
must match the App Store listing a reader may be cross-referencing.

**Two alternatives were considered and rejected by Omar:** `Omar Younis` (leaves the
policy and the App Store disagreeing on the responsible party) and `developed and
maintained by one person, Omar Saed Younis` (too informal for a policy).

**NO DATA PRACTICE CHANGES, and therefore no notification.** Nothing Nahtadi collects,
stores, transmits or shares is different — it remains nothing. Exactly as with C4, the
"Changes to This Privacy Policy" terms are satisfied by the Last Updated stamp alone:
no email, no in-app notice, no App Store submission.

**⚠️ THIS IS A BODY CHANGE, SO C6 NOW BINDS HARDER.** `lastUpdated` currently reads
`August 29, 2026`. C6 requires it to be the **publication** date, and publication is the
dev → main merge. The policy text has now moved twice; a stamp that does not match is
the exact defect C6 calls worse than the sentence it replaced. **Verify and correct it
at merge.**

## Amendment 4 — 2026-08-29, the page describes v1.1.0

**STATUS after Omar's rulings, 2026-08-29:**

| Row | Status |
|---|---|
| **J1** | **LOCKED VERBATIM** |
| **J2** | **LOCKED VERBATIM**, after the naming check below changed one word |
| **J3** | **LOCKED VERBATIM**, with a post-approval naming correction recorded below |
| **J4** | **LOCKED VERBATIM** (Amendment 5) |
| **J5** | **LOCKED VERBATIM** (Amendment 5) — **placement changed and string rewritten**, see Amendment 5 §1 |
| **J6** | **LOCKED VERBATIM**, rewritten to Omar's two requirements |

A LOCKED row carries the same status as the rest of this document: N3 lifts it
verbatim and does not re-edit it. **All six J-rows are now locked** — Amendment 5
closed J4 and J5.

**Why this amendment exists.** The N1 audit checked the copy for voice and for
accuracy against the canonical facts sheet — but that sheet predates **v1.2.0**.
The page therefore describes the app as it was at **v1.1.0 (April 2026)**. The
live app is **1.2.1** (§10). Voice was audited; the feature surface was not.

### Provenance — verified from source on 2026-08-29

Not reasoned about, not taken from the README (which is itself wrong — it still
claims 21). Read out of `~/Documents/github/nahtadi_ios_app`:

| Fact | Value | Source |
|---|---|---|
| Calculation methods | **22** | `Nahtadi/Nahtadi/Utilities/CalculationMethods.swift` — 22 entries in `CalculationMethods.all`, and 23 `static let` declarations minus the `all` map itself. Two independent counts. |
| The 22 as `name` (full legal names, NOT the UI labels — see §0) | ISNA · MWL · Egyptian General Authority · Umm Al-Qura · University of Islamic Sciences Karachi · University of Tehran · Leva Research Institute Qum · Gulf Region · JAKIM Malaysia · Kuwait · Qatar · MUIS Singapore · France (UOIF) · Diyanet Turkiye · Russia · UAE · Tunisia · Algeria · Kemenag Indonesia · Morocco · Portugal · Jordan Awqaf | same file. **The picker shows `shortName`, not these.** §0 lists all 22. |
| Onboarding steps | **7** — `welcome, location, method, adjustments, hijri, notifications, done` | `ViewModels/OnboardingViewModel.swift:18` |
| Re-run entry point | `Set Up Again` | `Views/SettingsView.swift:220`; copy at `Views/OnboardingPermissionSteps.swift:293` |
| Notification window | `scheduleDays = 10`, `appReminderDayOffset = 9` | `Utilities/Constants.swift` |
| Day-9 reminder is now a FALLBACK | "it only ever fires if nothing (foreground or background) has rescheduled for 9 straight days" | `Utilities/NotificationScheduler.swift:91`; `Utilities/BackgroundRefreshManager.swift` "silently pushes the 10-day [window]" |
| Marketing version | `1.2.1` | `Nahtadi.xcodeproj/project.pbxproj` |

The README's "21 Calculation Methods" is a defect **in the app repo**, already
recorded in that repo's `docs/ROADMAP.md` line 35. Out of scope here; noted so the
discrepancy is not mistaken for a conflict.

---

### 0. NAMING RULE — name an authority as the APP names it

**Raised as a check on J2 and it caught a real defect, so it is recorded here as a
rule rather than as a one-off fix.**

`CalculationMethod` carries two name fields (`CalculationMethods.swift:14-15`):
`name`, the full legal name "for documentation/accessibility", and **`shortName`,
"Abbreviated name for UI display"**. `shortName` is what the picker actually shows,
and it is what slot 3's screenshot on this very page displays.

**The rule: any authority named in site copy must be findable in the app's picker.**
The recognition moment this copy is built on only works if the word on the site is a
word in the app; a name that is not there converts recognition into confusion, which
is worse than the generic wording it replaced.

The 22 `shortName` values, which are the only names site copy may use:

> ISNA · MWL · EGAS · Umm Al-Qura (UQU) · Karachi (UISK) · Tehran University ·
> Leva Institute, Qum · Gulf Region · JAKIM, Malaysia · Kuwait · Qatar ·
> MUIS, Singapore · France (UOIF) · Turkiye · Russia · UAE · Tunisia · Algeria ·
> Indonesia (Kemenag) · Morocco · Portugal (Lisboa) · Jordan Awqaf

**What it caught: `Diyanet` is not in the app.** The picker says **`Turkiye`**. A
Turkish reader who saw "Diyanet" on the site and then scanned the picker for it
would not find it. `Diyanet` is struck from every row in this amendment. It was the
better-reading word and it is still the wrong one, so no ruling is sought: the row
exists to be recognised, and an unrecognisable name defeats it.

`JAKIM` and `Kemenag` both survive as substrings of real labels (`JAKIM, Malaysia`
and `Indonesia (Kemenag)`), so both remain findable. Where this amendment writes
`Indonesia (Kemenag)` rather than `Kemenag (Indonesia)`, that is the picker's own
word order, chosen over this document's own parenthetical style for the same reason.

### 1. The calculation-method count returns, at 22

F2 dropped `9+` because the count was unverified. It is now verified, and **`9+`
did not merely lack a source — it understated the real figure by more than half.**

**J1 is pre-approved wording and needs no new ruling.** F2's own note in §1 says:
*"If he later counts the methods … `Choose from N calculation methods for your
region.` is pre-approved wording — restoring a confirmed number is not a re-edit of
this lock."* J1 is that sentence with N = 22.

| # | Type | Location | BEFORE (the currently-locked string) | AFTER (proposed) | Chars |
|---|---|---|---|---|---|
| J1 | COPY | `screenshots` array, Calculation Methods caption (**supersedes F2**) | `Choose the method your region follows.` | `Choose from 22 calculation methods for your region.` | 38 → 51 |
| J2 | COPY | `features` array, Multiple Calculation Methods (**supersedes A5**) | `ISNA, MWL, UQU, EGAS, and more. Pick the method your region follows.` | `22 methods, from ISNA and MWL to JAKIM and Turkiye. Pick the one your region follows.` | 68 → 85 |

**Why the LIST does more work than the count, and how J2 uses both.** 22 is a
number; *ISNA, MWL, JAKIM, Turkiye* is a claim of worldwide reach that a specific
reader recognises. The page currently names only the four "usual" authorities, so
its worldwide coverage reads as generic. Naming two non-obvious ones — Malaysia's
JAKIM and Turkiye — is what turns "and more" into evidence, and it is the
moment of recognition for exactly the users the generic version leaves out.

**J2 length check:** 85 characters (unchanged by the naming fix), inside the existing feature-card envelope (the
unchanged five-prayer card is 92; A7 is 83). No layout consequence.

**J2 alternative, if Omar prefers the smallest possible delta from approved copy:**
`ISNA, MWL, UQU, EGAS and 18 more. Pick the method your region follows.` (70 chars)
— keeps the approved sentence intact and changes only `and more` → `and 18 more`.
It is weaker: it makes the reader add 4 + 18, and it still names only the usual
four. **Recommended: J2 as written.**

**A6 (`Works Worldwide`) is deliberately NOT changed.** Its claim is about
*latitude* ("beyond 48.5 degrees north or south"), not about regional authorities.
Putting the count there too would duplicate J2 and blur two different facts.

---

### 2. v1.2.0's setup flow — one clause, and NOT a ninth card

**Recommendation: it earns a mention, and the mention is a clause inside A3's FAQ
answer. It does not earn a card.**

**Why it earns a mention at all.** `/nahtadi/support`'s highest-friction question is
"my prayer times are wrong," and the answer is choosing the right calculation
method. v1.2.0 shipped a seven-screen flow that walks a user through exactly that,
plus `Set Up Again` so existing users can re-run it. That is the app's answer to its
own biggest friction. Nobody buys a prayer app because setup is pleasant — but they
abandon one because setup was confusing, and a prospective buyer reading that the
app walks them through it is reassured about the precise thing that makes these apps
annoying.

**Why NOT a ninth feature card — two reasons, and the second is the real one.**

1. **Layout cost.** The approved grid is four columns, so eight cards are two clean
   rows. A ninth makes three rows with a single orphan, which is a mockup revision
   and an `APPROVED.md` note for one line of copy.
2. **Category error.** All eight cards describe **what the app does**. Setup quality
   is an *experience*, not a capability. A ninth card would be the only one
   describing how it feels to use the app rather than what it computes, and that
   inconsistency would be visible even if the grid happened to fit ten.

**Why A3 and not the section sub.** A13 (`Prayer times, Qibla, Hijri dates, and
notifications. All of it on your device.`) is a parallel contents list; setup is not
a content and breaks the parallelism. A3 asks *"Which calculation methods are
supported?"* — and once the answer is **22**, *"how do I pick one?"* is the reader's
immediate next question, so the clause is on-topic rather than bolted on. **A3 also
feeds the FAQPage JSON-LD**, which Google surfaces detached from the page — the same
property that kept the price in A1. A setup answer that travels into a search
snippet is worth more than a card nobody scrolls to.

| # | Type | Location | BEFORE (the currently-locked string) | AFTER (proposed) |
|---|---|---|---|---|
| J3 | COPY | `faqs` array, "Which calculation methods are supported?" (**supersedes A3**) | `Nahtadi supports the major calculation methods: ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), the Egyptian General Authority (EGAS), and others. It also applies high-latitude adjustments beyond 48.5 degrees north or south, where the standard methods can fail during certain seasons.` | `Nahtadi supports 22 calculation methods, including ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), the Egyptian General Authority (EGAS), JAKIM (Malaysia), Turkiye and Indonesia (Kemenag). Setup walks you through choosing one the first time you open the app, and you can run it again from Settings. It also applies high-latitude adjustments beyond 48.5 degrees north or south, where the standard methods can fail during certain seasons.` |

**J3 carries a POST-APPROVAL NAMING CORRECTION — flagged, not slipped in.** Omar
approved J3 as written, before the J2 naming check existed. The approved string
named `Diyanet (Turkiye)` and `Kemenag (Indonesia)`; both fail §0. The locked string
says `Turkiye` and `Indonesia (Kemenag)` instead. The delta is two names and nothing
else, and it is applied rather than deferred because locking a string already known
to fail a rule set in the same amendment would be worse than correcting it. **One
line reverts it if Omar disagrees.**

**J3 is 470 characters against the current 313** — the longest answer on the page.
FAQ answers are long-form and this one now carries three facts, but if Omar wants it
shorter, **the second sentence is the severable one**: dropping `Setup walks you
through … from Settings.` returns it to 356 characters and leaves J1/J2 to carry the
count. That would mean the setup flow appears nowhere on `/nahtadi` and only on the
support page (J4/J5), which is a defensible outcome — it is the weaker of the two
placements on its own merits.

**`faqLd` is built from the `faqs` array by `.map()`, so the FAQPage JSON-LD updates
automatically.** Do not hand-edit it. (Same propagation note as A1–A4.)

---

### 3. `/nahtadi/support` — three answers that v1.2.0 made incomplete or wrong

**This section was not requested and is the most consequential part of the
amendment.** §6 currently keeps support FAQ 1, 2 and 3 verbatim, on the grounds that
they are *"technical instructions describing real iOS UI"* where *"literal accuracy
outranks concision."* That reasoning is exactly why they now need changing: the iOS
UI they describe changed in v1.2.0, so literal accuracy is what has been lost.

| # | Type | Location | BEFORE (exact) | AFTER (proposed) |
|---|---|---|---|---|
| J4 | COPY | support FAQ 1, "How do I change the prayer calculation method?" — **one sentence replaced**, rest of the answer untouched | `You can disable this to manually choose from various methods including ISNA (Islamic Society of North America), MWL (Muslim World League), UQU (Umm al-Qura University), EGAS (Egyptian General Authority of Survey), and others.` | `You can disable this to manually choose from 22 methods including ISNA (Islamic Society of North America), MWL (Muslim World League), UQU (Umm al-Qura University), EGAS (Egyptian General Authority of Survey), JAKIM (Malaysia) and Turkiye. You can also re-run the guided setup at any time from Settings, then Set Up Again.` |
| ~~J5~~ | **SUPERSEDED** | support FAQ 2 | *(no such sentence today)* | **This wording and placement are superseded by Amendment 5 §1.** It was drafted to sit fourth in the answer; it now leads it, and the aside phrasing no longer fits. Do not implement this string. |
| J6 | COPY | support FAQ 3, "How do I enable prayer time notifications?" — **final sentence replaced** | `On day 9, you'll receive a reminder notification asking you to open the app so it can automatically schedule the next batch of notifications.` | `The app keeps that window topped up in the background, so you normally never need to do anything. A reminder to open the app only appears if it has not refreshed for nine days.` |

**J6 is written as the better story, per Omar's ruling, not as a grudging
correction.** The numbers are correct and unchanged and are preserved: the 10-day
window stays in the retained sentence before it, and the nine days stays in the
replacement. **Only the causality is corrected.** The current copy frames the app as
something that nags you on day 9; the truth is that it schedules ten days ahead and
tops the window up in the background, so you normally never do anything and the
reminder only appears if the app has not run for nine days. Same facts, and it says
"this just works" instead of "you will be nagged". The replacement leads with the
good news for that reason.

**J6 is the real defect, and it is a v1.2.0 regression in the copy rather than a
voice problem.** The answer presents the day-9 reminder as **the** mechanism — "on
day 9, you'll receive a reminder" — which was true at v1.1.0. v1.2.0 added
`BGAppRefreshTask` background refresh that *"silently pushes the 10-day window"*, and
the scheduler's own comment now reads: *"it only ever fires if nothing (foreground or
background) has rescheduled for 9 straight days."* So the reminder is a **fallback
most users will never see**, and the current answer tells every reader to expect a
notification that will probably never arrive. **The numbers are unchanged and
correct** (`scheduleDays = 10`, `appReminderDayOffset = 9`); only the mechanism
described around them is wrong.

**J4/J5 add a route, they do not remove one.** A user who wants to change one setting
should not be sent through a seven-screen flow, so both answers keep their existing
step-by-step instructions in full and gain a second path.

### What J4 and J5 each need a ruling on

**J4 — two changes in one row, and they can be taken separately.**

1. **The count.** `various methods … and others` becomes `22 methods … JAKIM
   (Malaysia) and Turkiye`. This is the same fix as J1/J2 applied to the support
   page, which has the same vague wording. Names are `shortName` values per §0.
2. **The `Set Up Again` route**, as a new final sentence. This is the row's real
   content: the answer explains how to change the method manually and, since
   v1.2.0, there is an easier path it does not mention.

**Omar can approve 1 without 2.** Taking only the count leaves the answer accurate
but still missing the easier route; taking both is the recommendation.

**J5 — one inserted sentence, and the only question is whether it earns its place.**

The answer is already long: Location Services, then calculation method, then
Automatic Selection, then a support email with four things to gather. J5 adds a
fifth step before the email. **The case for it:** this is the page's
highest-friction question, and the guided flow is the app's own answer to it, so a
user who is lost gets a route instead of a checklist. **The case against:** the
answer is a diagnostic sequence, and inserting "or just re-run setup" mid-sequence
may read as giving up on the diagnosis.

**Recommendation: take it**, placed immediately after the calculation-method
sentence and before the support-email fallback, so the order is diagnose, then
guided fix, then contact me. That is the escalation order a reader expects.

> **OVERTAKEN BY THE RULING.** Omar approved J5 but reversed the placement, and he
> was right: the onboarding flow covers *every* item this FAQ walks through by hand,
> so it is not a fallback for failed diagnosis, it is a shortcut past the whole
> sequence. Fourth place buries the easiest fix on the page's hardest question. The
> locked wording and placement are in **Amendment 5 §1**.

**Neither row touches the FAQPage JSON-LD on `/nahtadi`** — these are
`/nahtadi/support` answers, which are rendered as page content only.

---

### Register updates this amendment forces

- **§1, F2's note** — its condition is **discharged**. The note says a confirmed
  number may return; 22 is confirmed from source, and J1 is the pre-approved sentence
  it authorised. `9+` still never returns, because it was wrong as well as
  unverified.
- **§6, "Kept on `/nahtadi`"** — the rows for A5's description and A3's answer are
  superseded by J2 and J3.
- **§6, "Kept on `/nahtadi/support`"** — **FAQ 1, FAQ 2 and FAQ 3 are no longer kept
  entire.** Each keeps its structure and its step-by-step instructions; J4, J5 and J6
  are surgical. The §6 rationale ("literal accuracy outranks concision") is not
  overturned — it is what these rows serve.
- **§10, the App Store ledger** — unaffected. No fact in it changes.

### SEO impact

**No keyword is lost and one is strengthened.** `calculation methods` appears in J1,
J2, J3 and J4 where it previously appeared in three of the four; the regional
authority names (`JAKIM`, `Turkiye`, `Kemenag`) are net-new long-tail terms with real
intent behind them. `Qibla`, `offline`, `privacy` and `prayer times` are untouched.

**No metadata changes.** The four description slots (B3–B6) do not mention method
counts, so the 160-character constraint is not engaged by any row here. Titles are
untouched.

### Constraints checked

No em dashes in any AFTER string. No AI cadence. Numbers written naturally (`22
methods`, `nine days`, `48.5 degrees`). Canonical facts only, every one traced to a
source file above. **The privacy policy is untouched.**

## Amendment 5 — 2026-08-29, J4/J5 locked, and the screenshots are real again

Three things: J4 and J5 close, the six screenshot binaries are replaced from the
live app, and two strings are mined from the app's own onboarding copy.

### 1. J4 and J5 are LOCKED — J5 with a placement change

**J4 is taken in full**, count and route together. The route is verified in source:
`Views/SettingsView.swift:220` is `Button("Set Up Again")`, footered
`"Walk through the setup steps again with your current choices."`

**J5 is approved with its placement REVERSED, and the string is rewritten to suit.**

Amendment 4 recommended placing the guided-setup sentence fourth — after the manual
diagnostic steps, before the email fallback — on the reasoning that the order should
be diagnose, then guided fix, then contact me. **That reasoning was wrong, and
walking the flow is what showed it.** The seven onboarding screens cover Location,
Method, Adjustments, Hijri date and Notifications: **every item the FAQ walks through
by hand.** So it is not a fallback for when diagnosis fails, it is a shortcut past
the entire sequence. Placed fourth, most readers never reach the easiest fix, on the
page's highest-friction question.

It therefore **leads the answer**, and because it leads rather than interrupts, the
Amendment 4 wording no longer fits: `If you would rather be walked through it …`
is phrased as an aside, which is exactly the wrong register for a first sentence.

| # | Type | Location | BEFORE | AFTER (LOCKED) |
|---|---|---|---|---|
| J5 | COPY | support FAQ 2, "The prayer times seem incorrect. What should I check?" — **prepended as the answer's opening**, existing text follows unchanged | *(no such sentence today)* | `The fastest fix is to re-run the guided setup: open Settings, then Set Up Again. It covers location, calculation method, adjustments, the Hijri date and notifications, which is every check below.` |

The existing answer then begins `First, verify that Location Services are enabled…`
unchanged, and `First` now reads as the first manual check for a reader who prefers
to do it themselves. Nothing is removed; the email fallback keeps its place last.

### 2. The screenshots are replaced — the staleness workstream is CLOSED

All six screenshots are new captures from the live app at **v1.2.1**. They now live
at `public/images/nahtadi/screenshots/2026-08-29/screenshot-1..6.png` — a **dated set
directory**, added 2026-08-30 by Amendment 7 below. Slot numbers are unchanged and
every locked row still points at the same image; only the directory moved. The previous set dated from **9 April 2026**, six days before
the v1.1.0 submission: two releases stale, and slot 4 baked `v1.1.0` into the image.

**Slot mapping — caption order is deliberately preserved**, so every locked row keeps
pointing at the right image:

| Slot | Screen | Caption row |
|---|---|---|
| 1 | Prayer Times | unchanged |
| 2 | Qibla Compass | unchanged |
| 3 | Calculation Methods — now the method picker itself | **J1** |
| 4 | Notifications | unchanged (A12) |
| 5 | Settings | unchanged |
| 6 | was Offline Mode, **now the guided setup** | **K1 below** |

**Verified in the new binaries, not assumed:**

- **One city, one date, one appearance.** Slot 1 reads `Sunnyvale, CA` /
  `August 29, 2026` / `14 Rabi' Al-Awwal 1448`; slot 2's Qibla bearing is `19.3°`,
  which is the correct great-circle bearing from Sunnyvale; slot 3 reads
  `Detected country: United States`. All six are light appearance with a `09:41`
  status bar. This is the rule that matters most and it holds.
- **Slot 3 corroborates J1 without literally proving it.** The picker is scrolled, so
  twelve of the twenty-two are visible (`Algeria`, `EGAS`, `France (UOIF)`,
  `Gulf Region`, `ISNA` checked, `Indonesia (Kemenag)`, `JAKIM, Malaysia`,
  `Jordan Awqaf`, `Karachi (UISK)`, `Kuwait`, `Leva Institute, Qum`,
  `MUIS, Singapore`). It shows a long list that continues past the fold; it does not
  display a count. **J1's "22" rests on the source count, not on this image**, and
  the image should not be described anywhere as showing all 22.
- **The visible labels are exactly the `shortName` values** Amendment 4 §0 locked,
  which is that rule confirmed on screen rather than in source.

**Resolution changed** from `1320x2868` to `1206x2622` (iPhone 17 Pro). Aspect ratio
moves from 9:19.55 to 9:19.567 — a 0.1% difference. The approved device frame is
`aspect-ratio: 9/19.55` with `object-fit: cover`, so the new images crop by a
fraction of a pixel and there is **no layout consequence and no mockup revision**.
Recorded so the number change is not mistaken for one.

### 3. Slot 6's caption changes meaning — the only caption row that moves

Slot 6 was `Offline Mode` / `Works without internet, using your last known location.`
The new image is the onboarding welcome screen, so that caption is now simply wrong.

| # | Type | Location | BEFORE (locked) | AFTER (LOCKED) | Chars |
|---|---|---|---|---|---|
| K1 | COPY | `screenshots` array, slot 6 **title** | `Offline Mode` | `Guided Setup` | 12 → 12 |
| K1 | COPY | `screenshots` array, slot 6 **description** (supersedes **F3**) | `Works without internet, using your last known location.` | `Set up takes about two minutes, and you can run it again any time.` | 55 → 66 |

**`Guided Setup` matches the language J3, J4 and J5 already use**, so the family is
consistent. 66 characters sits inside the caption envelope (51 to 77).

**The two-minute promise is the point.** It is concrete, it is the app's own claim,
and the page makes no comparable promise anywhere else. The second clause carries the
`Set Up Again` fact into the page copy for readers who never open the FAQ.

**The offline claim is NOT lost.** It survives in the hero line (`No ads. No
tracking. Just salat.` sits beside it), in feature card A10 (`Calculated on your
device. No internet connection required.`), in FAQ A4, and in the new slot 6 image's
own on-screen text (`Prayer times and Qibla work fully offline.`). Nothing that was
said is now unsaid.

**This breaks §6's register**, which kept "all six screenshot `title` values". Slot 6
is now the single exception; the other five titles stand.

### 4. Mined from the app's onboarding copy

The onboarding screen says four things, in Omar's own already-shipped words. **Two
are taken, two are not**, and the two rejections are recorded so they are decisions:

| App string | Verdict |
|---|---|
| `Nothing is ever sent to us. No servers, no accounts.` | **TAKEN as K2**, converted out of the corporate plural. |
| `Set up takes about two minutes.` | **TAKEN as K1.** |
| `Prayer times and Qibla work fully offline.` | **Not taken.** A10 already says `Calculated on your device. No internet connection required.`, which is the same claim and names the mechanism. No gain. |
| `Prayer times, Qibla, and the Hijri calendar. All on your phone.` | **Not taken.** A13 is `Prayer times, Qibla, Hijri dates, and notifications. All of it on your device.` — near-identical and it also carries notifications, so the site's version is the stronger one. |

| # | Type | Location | BEFORE (locked A16) | AFTER (LOCKED) | Chars |
|---|---|---|---|---|---|
| K2 | COPY | Privacy section sub (**supersedes A16**) | `Nahtadi collects nothing and transmits nothing. Your data stays on your device.` | `Nahtadi collects nothing and transmits nothing. No servers, no accounts.` | 78 → 71 |

**Why this is worth amending a locked row.** A16's first sentence is an assertion;
`No servers, no accounts` is **concrete and checkable**, which is the difference
between claiming privacy and demonstrating it. It is also **shorter**, and it removes
a redundancy that was already there: A16's old second sentence, `Your data stays on
your device.`, restates the section heading `Nothing leaves your device.` almost word
for word. The replacement adds information where the original repeated itself.

**THE VOICE TRAP, and it is why this row is not a verbatim lift.** The app says
`sent to us`. Lifting that would reinstate the corporate plural **F1 spent an entire
pass removing**, on a page whose voice is settled as first person singular (A18
already says `how to reach me`). The fix is to drop the clause containing the plural
rather than to rewrite it: `No servers, no accounts` carries the whole payload with
no grammatical person at all, so it needs neither `us` nor `I`. **Checked on word
boundaries: no `we`, `us`, `our` in any Amendment 5 string.**

**A16's load-bearing note survives.** §1 records that A16 is phrased to match the
privacy policy's own `does NOT collect, transmit, or share any personal
information`. K2 keeps that first sentence untouched, so the alignment holds; only
the redundant second sentence is replaced. **If the policy changes, K2 changes with
it, exactly as A16 did.**

### Register updates

- **§6, "Kept on `/nahtadi`"** — "all six screenshot `title` values" now has one
  exception (slot 6, K1). A16's row is superseded by K2.
- **§1, F3** — superseded by K1's description. F3 was an accuracy fix to a caption
  whose image no longer exists; the accuracy point it made stands and is simply moot.
- **Amendment 4's `J4`/`J5` PROPOSED status** — closed. All six J-rows locked.
- **§10** — unaffected. `1.2.1` was already the recorded live version; these captures
  come from it.

### Constraints checked

No em dashes in any AFTER string. No corporate plural, verified on word boundaries.
Numbers natural (`22 methods`, `two minutes`, `nine days`). No metadata touched. The
privacy policy is untouched. Every fact traced to source or to the new binaries.

## Audit ID traceability

Row IDs match the N1 audit table so approvals can be traced back. Six notes:

- The audit's **F3** was the "Always accurate" screenshot caption and **F6** was the
  JSON-LD price. Omar's ruling message labelled the price ruling "F3". Both are
  approved and both appear below, under their **original audit IDs** (F3 = caption,
  F6 = price). No row was lost to the renumber.
- **D15 is new.** An exhaustive `we|our|us` grep after the ruling found an eighth
  plural-voice occurrence that the audit table missed. It is listed rather than
  applied silently — see §4.
- **The `H` prefix is Amendment 2's.** H1 (ratings count) and H2 (newsletter removal)
  have no audit-table ancestor — they came out of Omar's rulings on 2026-08-28, not
  the original copy pass. Both are in §1.
- **A19, A20 and A21 are STRUCK**, not missing. They rewrote copy for the newsletter
  section that H2 deletes. They are in §7 with the reason.
- **A23 is Amendment 3's, and it has no audit-table ancestor either.** It is the only
  row in this document that ADDS a string rather than replacing one — the `PRIVACY`
  eyebrow that N2's design introduced. It is numbered in the `A` (page copy) series
  because that is what it is, and it is recorded here rather than left living only in
  a mockup.
- **The `J` prefix is Amendment 4's, and the rows are PART LOCKED, PART PROPOSED.**
  They have no audit-table ancestor because the audit could not have found them: it
  checked voice and checked the facts it had, and its facts sheet predated v1.2.0.
  J1–J3 supersede F2, A5 and A3; J4–J6 amend `/nahtadi/support` FAQs 1–3, which §6
  had kept entire. **J1, J2, J3 and J6 are LOCKED VERBATIM** (2026-08-29) and N3
  lifts them like any other row. **J4 and J5 remain PROPOSED — N3 must not lift
  either until it is locked.** Amendment 4's §0 also sets a durable naming rule that
  binds any future row naming a calculation authority.
- **The `K` prefix is Amendment 5's**, and both rows are **LOCKED**. K1 supersedes F3
  and changes the one screenshot `title` §6 had kept; K2 supersedes A16. They exist
  because the screenshot binaries were replaced from the live app, which changed what
  slot 6 depicts, and because the app's own onboarding copy said one thing better
  than the site did. Amendment 5 also closes J4 and J5, so **every J-row and K-row is
  now locked and N3 lifts all of them verbatim.**

---

## 1. `/nahtadi` — page copy

**File:** `src/app/nahtadi/page.tsx` (all rows in this section)

**Propagation note:** rows A1–A4 live in the `faqs` array (lines 20–37). `faqLd` is
built from that array by `.map()`, so the FAQPage JSON-LD updates automatically. Do
not hand-edit `faqLd`.

### FAQ answers

| # | Type | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|
| A1 | COPY | `Many prayer apps are "free" because they make money from ads and your data. Nahtadi is a one-time purchase because we believe your worship shouldn't be monetized. No ads means no incentive to track you. One payment means we don't nag you with subscription prompts during salat.` | `Many prayer apps are free because they make money from ads and your data. Your worship should not be a revenue stream. Nahtadi is a one-time $3.99 purchase: no ads, so there is nothing to gain from tracking you, and no subscription prompts arriving in the middle of salat.` |
| A2 | COPY | `Yes. Nahtadi collects zero personal data. Everything — your location, settings, and preferences — stays on your device. There are no analytics, no third-party trackers, and no accounts to create.` | `Yes. Nahtadi collects zero personal data. Your location, settings, and preferences stay on your device. There are no analytics, no third-party trackers, and no accounts to create.` |
| A3 | COPY | `Nahtadi supports all major calculation methods including ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), Egyptian General Authority (EGAS), and more — with high-latitude adjustments for extreme latitudes.` | `Nahtadi supports the major calculation methods: ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), the Egyptian General Authority (EGAS), and others. It also applies high-latitude adjustments beyond 48.5 degrees north or south, where the standard methods can fail during certain seasons.` |
| A4 | COPY | `Completely. Prayer times are calculated on-device using astronomical algorithms, so Nahtadi works offline anywhere in the world once installed.` | `Prayer times are calculated on your device using astronomical algorithms, so Nahtadi works offline anywhere in the world once installed.` |

**A1 carries the price — amended 2026-08-28, re-approval required.** Omar approved
A1's wording before Amendment 1, so the inserted amount is called out rather than
slipped in. The delta against the approved string is exactly six characters:
`a one-time purchase` → `a one-time $3.99 purchase`.

- **Why here.** A pricing answer that never states the price is odd on its own terms,
  and this row is what makes `offers` in the JSON-LD represent visible content.
  `one-time purchase` survives intact as a phrase — it is in the locked description,
  the "Why" card, and now this answer.
- **Placement is N2's call; the string is this document's.** N2 may surface the amount
  somewhere additional or better (the `One-Time Purchase` card is the obvious
  alternative). What N2 may **not** do is leave the price invisible everywhere — that
  is the constraint the row exists to satisfy, and it is load-bearing for §2's F6.
- **The amount must be confirmed against the live App Store listing before N3 ships.**
  `$3.99` is carried over from the existing JSON-LD, which is precisely the value the
  audit flagged as unverified. It was low-stakes while invisible; it is not now. If the
  real price differs, change the number in **both** places (this string and
  `offers.price`) — they are two renderings of one fact and must agree.
- **This string feeds the FAQPage JSON-LD** via the `faqs` array, so after this change
  the price appears in two structured-data blocks. Same fact, same number, always.
- Currency: the visible string carries `$` only, while `offers.priceCurrency` stays
  `'USD'`. Standard and correct — the markup is explicit where machines read it.

**A1 source-encoding note:** the BEFORE literal is a double-quoted JS string with
escaped inner quotes (`\"free\"`). The AFTER text has no quotes and no apostrophes,
so it may be written as a plain single-quoted string like its neighbours.

**A3 fact provenance:** 48.5 degrees and "can fail during certain seasons" are taken
from `/nahtadi/support`'s own existing answer ("high-latitude adjustments for
locations at ±48.5 degrees latitude … where traditional calculation methods may not
work during certain seasons"). No new fact is introduced.

### Feature cards (`features` array)

| # | Type | Card | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| A5 | COPY | Multiple Calculation Methods | `ISNA, MWL, UQU, EGAS, and more — pick the method for your region.` | `ISNA, MWL, UQU, EGAS, and more. Pick the method your region follows.` |
| A6 | COPY | Works Worldwide | `Supports all locations globally with high-latitude adjustments for extreme latitudes.` | `Works at any latitude, with adjustments beyond 48.5 degrees north or south.` |
| A7 | COPY | Qibla Direction | `Find the precise direction to Mecca from anywhere in the world with compass integration.` | `Points to the Kaaba in Mecca from anywhere in the world, using your device compass.` |
| A8 | COPY | Hijri Calendar | `Seamlessly convert between Hijri and Gregorian calendars with a built-in converter.` | `Hijri and Gregorian dates together, with a converter for any date.` |
| A9 | COPY | Prayer Notifications | `Customizable reminders for each prayer time so you never miss Salat.` | `A reminder for each prayer, switched on or off individually.` |
| A10 | COPY | Fully Offline | `Works completely offline once installed. No internet connection required.` | `Calculated on your device. No internet connection required.` |
| A11 | COPY | Privacy First | `All data stored locally on your device. No tracking, no data collection, ever.` | `All data stays on your device. No tracking and no data collection.` |

**Card `title` values are UNCHANGED** for all eight feature cards. Only `description`
strings move. The titles carry the `Qibla`, `Offline` and `Privacy` keywords — see §8.

### Screenshot captions (`screenshots` array)

| # | Type | Caption | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| A12 | COPY | Notifications | `Customizable notifications for each prayer time so you never miss Salat.` | `Turn notifications on per prayer, Fajr through Isha.` |
| F2 | COPY | Calculation Methods | `Choose from 9+ calculation methods for your region.` | `Choose the method your region follows.` |
| F3 | COPY | Offline Mode | `Works without internet using your previous location. Always accurate.` | `Works without internet, using your last known location.` |

**F2 — the number can come back.** Omar has not confirmed a method count from the
app, so the locked wording is non-numeric. If he later counts the methods in the
Settings tab and confirms the figure, `Choose from N calculation methods for your
region.` is pre-approved wording — restoring a *confirmed* number is not a re-edit of
this lock. `9+` specifically does not return without that confirmation.

**F3 — this is an accuracy fix, not a voice edit.** `Always accurate` contradicted its
own sentence: a cached location gives times accurate for *that* location, which is
precisely wrong after travelling.

### Section headings and subheadings (JSX)

| # | Type | Location | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| A13 | COPY | "Everything You Need for Salat" sub | `Nahtadi provides comprehensive tools for Muslims to stay connected to their daily prayers` | `Prayer times, Qibla, Hijri dates, and notifications. All of it on your device.` |
| A14 | COPY | "App Preview" sub | `Take a look at Nahtadi&apos;s beautiful and intuitive interface` | `Six screens from the app.` |
| A15 | COPY | Privacy section `<h2>` | `Your Privacy Matters` | `Nothing leaves your device.` |
| A16 | COPY | Privacy section sub | `Nahtadi is designed with privacy-first principles. Your data stays on your device.` | `Nahtadi collects nothing and transmits nothing. Your data stays on your device.` |
| ~~A19~~ | **STRUCK** | Email section `<h2>` | ~~`Stay in the Loop`~~ | **Section deleted by H2. See §7.** |
| ~~A20~~ | **STRUCK** | Email section sub | ~~`Get notified about new features and updates.`~~ | **Section deleted by H2. See §7.** |
| A23 | **NEW COPY** | Privacy section eyebrow, immediately above A15's `<h2>` | *(no such element today)* | `PRIVACY` |

**A23 is an ADDITION, not a replacement** — the only row in this document that
creates a string rather than rewriting one. Added by Amendment 3 (2026-08-28);
the reasoning for why this section and only this section carries an eyebrow is
recorded there. It renders in the sitewide `.section-eyebrow` treatment, and on
the green flagship band its colour is `--flagship-meta`, not `--accent`.

**Section `<h2>` values NOT listed here are unchanged:** `Why Nahtadi?`,
`Everything You Need for Salat`, `App Preview`, `Frequently Asked Questions`. See §6.

**A13/A14 add terminal periods** where the originals had none. That is part of the
locked text, not a typo to normalise away.

**A16 wording is load-bearing:** "collects nothing and transmits nothing" is phrased to
match the privacy policy's own "does NOT collect, transmit, or share any personal
information". If the policy ever changes, this line changes with it.

### Cards and badge

| # | Type | Location | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| A17 | COPY | Privacy Policy card body | `Learn how Nahtadi protects your privacy with no data collection.` | `What Nahtadi stores, what it never sends, and how to revoke location access.` |
| A18 | COPY | App Support card body | `Have questions? Check our FAQ or contact our support team.` | `Setup, calculation methods, notifications, and how to reach me.` |
| A22 | COPY | Ratings badge | `{project.appStoreRating.value}★ · {project.appStoreRating.count} Ratings on the App Store` | `{project.appStoreRating.value}★ · {project.appStoreRating.count} ratings on the App Store` |
| ~~A21~~ | **STRUCK** | `EmailSignup.tsx` success message | ~~`You&apos;re in! We&apos;ll keep you posted.`~~ | **Component deleted by H2. See §7.** |

**A22 is a one-character change** (`Ratings` → `ratings`). The two JSX expressions are
untouched — the numbers stay sourced from `projects.json` via the data layer, which is
what makes H1 a one-field edit rather than a copy edit.

**A17 accuracy:** the three things named — what is stored, what is never sent, how to
revoke location access — are each an actual section of the privacy policy. If the
policy's sections change, this line changes with them.

### Data — the ratings count

| # | Type | File | BEFORE (exact) | AFTER (exact) |
|---|---|---|---|---|
| H1 | **DATA** | `src/data/projects.json`, Nahtadi entry | `"appStoreRating": { "value": "5.0", "count": 8 }` | `"appStoreRating": { "value": "5.0", "count": 7 }` |

**One field, three consumers.** `appStoreRating.count` feeds the visible ratings badge
(A22), the reviews section, **and** `aggregateRating.ratingCount` in the
SoftwareApplication JSON-LD that Google reads. Editing it once updates all three; there
is no second place to change and no copy string to touch.

**Why 7 and not 9 — record this, because 7 looks like the wrong choice without it.**
Three sources disagreed: App Store Connect reports **9 worldwide**; Apple's public
lookup API and the US storefront both report **7** (App Store counts are
per-storefront); `projects.json` said **8**, a stale snapshot matching neither.

9 is the truer number today. It is still the wrong one to store, because **sub-project
5 will automate these facts from Apple's public lookup API, and that API is per-country
and cannot return a worldwide total.** Choosing 9 means either reverting to 7 when
automation lands, or keeping this field permanently hand-maintained — which is exactly
how it drifted to 8 in the first place. **A narrower number that is always right beats
a truer number that is usually stale.**

**`value` is unchanged at `"5.0"`** — confirmed on both sources (§10). So About's locked
copy, the Home ticker item and the Home flagship meta line are all unaffected; none of
them carry the count.

**Do not "correct" this to 9.** The source of record is Apple's public lookup API on
the US storefront. See §10 and the sub-project 5 entry in `docs/ROADMAP.md`.

### Deletions

| # | Type | Location | BEFORE (exact) | AFTER |
|---|---|---|---|---|
| E1 | COPY | Below the "App Preview" sub | `<p className="text-sm text-gray-500">Scroll to see more →</p>` | **Delete the entire `<p>` element.** |
| H2 | COPY | The `Stay in the Loop` `<section>`, whole | Heading `Stay in the Loop`, sub `Get notified about new features and updates.`, `<EmailSignup />`, and the Instagram follow line | **Delete the entire `<section>`, its `EmailSignup` import, and the file `src/components/nahtadi/EmailSignup.tsx`.** |

**H2 — why the newsletter goes.** Omar does not write newsletters and nobody has ever
subscribed, so the form is dead weight. Two further reasons make removal the right call
rather than merely a tidy one:

- **It is the site's only runtime third-party dependency.** `EmailSignup.tsx` does a
  client-side `POST` to `buttondown.com`. Deleting it removes the last one.
- **It contradicts the page around it.** After A15 and A16, this page says
  **"Nothing leaves your device"** and **"Nahtadi collects nothing and transmits
  nothing"** — and then, one section later, transmitted an email address to a third
  party. The claims are about the *app*, not the site, so it was not false; it read as
  false, which on a privacy-first page is the same problem. The audit's §9 note that
  the form "may be lying" about success (opaque `no-cors` response) is resolved by
  deletion too.

**Scope of H2 — three things go:** the `<section>` in `page.tsx`, the `EmailSignup`
import at the top of that file, and the component file itself. **The Instagram follow
line lives inside this section.** It is not newsletter copy and Omar has not ruled on
it; it goes with the section unless N2 rehouses it. **Flagging rather than deciding:**
if the `@Hendaseh` Instagram link should survive, N2 places it — otherwise the site
loses that link entirely, which is a design call and not this document's to make.

**Why deletion and not a glyph swap.** Grammar v2 (`docs/superpowers/mockups/contact/APPROVED.md`)
bans Unicode arrows outright. The three options were: swap in the self-drawn
chevron-right (rejected — grammar v2 assigns that glyph to *internal navigation*, and
this is neither navigation nor a link, so reusing it would corrupt a locked five-glyph
vocabulary); mint a sixth glyph (rejected — not worth a new family member for a hint
line); or delete. **Verified before ruling:** `ScreenshotGallery.tsx` renders its
`Scroll left` / `Scroll right` buttons with no breakpoint gating, so the affordance
already exists at every width and the sentence was redundant. Deleted.

---

## 2. `/nahtadi` — metadata and JSON-LD

**File:** `src/app/nahtadi/layout.tsx` unless stated otherwise.

### Title

| # | Type | Slot | BEFORE (exact) | AFTER (exact final text) | Chars |
|---|---|---|---|---|---|
| B1 | METADATA | `title.absolute` | `Nahtadi — Islamic Prayer Times. No Ads. No Tracking.` | `Nahtadi - Islamic Prayer Times. No Ads. No Tracking.` | 52 → 52 |
| B1 | METADATA | `openGraph.title` | `Nahtadi — Islamic Prayer Times. No Ads. No Tracking.` | `Nahtadi - Islamic Prayer Times. No Ads. No Tracking.` | 52 → 52 |
| B1 | METADATA | `twitter.title` | `Nahtadi — Islamic Prayer Times. No Ads. No Tracking.` | `Nahtadi - Islamic Prayer Times. No Ads. No Tracking.` | 52 → 52 |

**All three copies move together.** The separator is U+002D HYPHEN-MINUS, matching the
` - ` separator B5 standardised sitewide. The change is one character per copy and
keyword-identical. The frozen contract on this page is the **URL**, not the title text
— `title.absolute` still opts out of the root `%s - Omar Younis` template, and that
mechanism is unchanged.

| # | Type | Slot | BEFORE | AFTER |
|---|---|---|---|---|
| B2 | METADATA | `title.template` | `%s \| Nahtadi` | `%s - Nahtadi` |

**Why `Nahtadi` stays in the site slot** rather than converging on `Omar Younis`:
`siteName: 'Nahtadi'` is already set on all three pages, and a visitor arriving from
the App Store's privacy-policy link came for the product, not the portfolio. Only the
separator converges. The block comment above `title` in `layout.tsx` explaining the
`absolute` / `template` split stays accurate and should be left in place.

### Descriptions — one string, four slots

The following string is written **byte-identical into four places**, which is the
no-drift pattern B5 applied to the other four pages:

```
Accurate Islamic prayer times and Qibla direction for iOS. Zero ads, zero data collection, works offline. One-time purchase, built by a Muslim developer.
```

**153 characters.** Under the 160 limit.

| # | Type | Slot | BEFORE (exact) | Chars |
|---|---|---|---|---|
| B3 | METADATA | `metadata.description` (layout.tsx) | `Nahtadi — Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.` | 142 → 153 |
| B4 | METADATA | `openGraph.description` (layout.tsx) | `Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.` | 132 → 153 |
| B5 | METADATA | `twitter.description` (layout.tsx) | `Accurate prayer times with zero ads and zero data collection. One-time purchase. Works offline.` | 95 → 153 |
| B6 | METADATA | `jsonLd.description` (**`page.tsx`**, SoftwareApplication) | `Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.` | 132 → 153 |

**B6 is in a different file** — `src/app/nahtadi/page.tsx`, inside the `jsonLd` object.
It is not optional and it does not move independently: the SEO constraint is that the
JSON-LD description stays aligned with the page description. B3 and B6 ship together
or neither ships.

**What the new string buys:** `Qibla` and `iOS` were in the `keywords` array but absent
from every description on the page. They are now in all four. The three previous
variants collapse to one.

### OG image alt

| # | Type | Slot | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| B7 | METADATA | `openGraph.images[0].alt` | `Nahtadi - Islamic Prayer Times App` | `Nahtadi - Islamic Prayer Times` |

Unifies with C1 and D2, which strip an em dash from the same alt text on the other two
pages. All three read `Nahtadi - Islamic Prayer Times` afterwards.

### JSON-LD offer

| # | Type | Location | BEFORE | AFTER |
|---|---|---|---|---|
| F6 | METADATA | `jsonLd.offers` in `page.tsx` | `offers: { '@type': 'Offer', price: '3.99', priceCurrency: 'USD' }` | **UNCHANGED. Keep the block exactly as it is.** |

**Amended 2026-08-28. The original F6 deleted this block; that ruling is struck.**

**Do not remove `offers`.** Google's SoftwareApplication rich result requires
**name + `offers` + `aggregateRating` together**. This page has all three, so it is
eligible. Deleting `offers` would not just drop the price from the search result — it
would drop the page out of rich-result eligibility entirely, **taking the 5.0 star
rating with it**. That is a search regression on the one page whose SEO must not
regress, and it is the exact opposite of what the original ruling was trying to buy.

**The real defect is fixed from the other end.** The genuine problem was that `3.99`
appeared only in markup and nowhere a user could see it — a structured-data guidelines
mismatch, since markup must represent visible content. **Row A1 now states the price in
the pricing FAQ**, which resolves the mismatch while keeping the rich result whole.

This also beats deletion on the original staleness concern. A **visible** price is
self-correcting: Omar reads his own page and would notice a wrong number. An invisible
one, machine-read straight into Google, can sit wrong indefinitely.

**Standing dependency — `offers`, `aggregateRating` and A1 are now one unit:**

- `offers` may not be deleted while the rich result is wanted.
- `offers.price` and A1's visible `$3.99` are two renderings of one fact. **Change one,
  change the other**, or the guidelines mismatch returns in reverse.
- If a future task ever does remove `offers` deliberately, it is accepting the loss of
  the star rating in search. That is a decision for Omar, not a cleanup.

The `aggregateRating` block is **UNCHANGED** — sourced from `projects.json`
(`appStoreRating`, 5.0 / 7 after H1) and matching the visible ratings badge, so it already
satisfied the guideline the price failed. It is also the half of the rich result with
real value, which is why the original ruling's collateral damage was disqualifying.

---

## 3. `/nahtadi/privacy`

**File:** `src/app/nahtadi/privacy/page.tsx`

### The policy body is UNCHANGED except for one ruled sentence

Every other em dash on this page was in **metadata**, not in a commitment. No sentence
is restructured, no paragraph is tightened, no cadence rule is applied. The formal
register is correct for a legal document and is deliberate.

| # | Type | Location | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| C4 | COPY | Children's Privacy, second sentence | `Since no data is collected at all, the app is safe for users of all ages.` | `Nahtadi collects no personal data from any user, including children.` |

**The first sentence of that section is UNCHANGED:** `This app does not knowingly
collect information from children under 13 years of age.` Only the second sentence is
replaced. The section then reads:

> This app does not knowingly collect information from children under 13 years of age.
> Nahtadi collects no personal data from any user, including children.

**Why this exact sentence.** The original inferred a *safety* claim from a *data*
premise — a category error, in the one section Apple reads closely. The replacement
states only what the rest of the policy already commits to, restricted to the subject
of the section. It adds no new promise: "does not collect, transmit, or share any
personal information" is the policy's own Data Collection heading.

**The App Store 4+ age rating is deliberately NOT cited here.** 4+ is a **content**
rating. Invoking it in a privacy policy to support a data claim re-imports the same
category error the fix exists to remove. Do not add it to this page in a later pass.

### Last Updated date — this now has to move

| # | Type | Location | BEFORE | AFTER |
|---|---|---|---|---|
| C6 | **ACTION FOR N3** | `const lastUpdated` | `'February 13, 2026'` | The date N3 merges the change, in the same `Month D, YYYY` format. |

**This supersedes the N1 audit's C6**, which said the date must not move. That was
correct at the time and is now void: it was conditioned on the policy body having zero
changes, and C4 changes it. A policy whose text changed while its stamp did not is a
worse defect than the sentence C4 removes.

**The date must reflect when the policy goes PUBLIC, not when N3 runs.** N3 works on
`dev`; the policy is not published until the dev → main merge, which B6 owns and which
may land days later. A stamp reading the day the code was written, on a page that went
live the following week, is wrong in the same way the stale stamp was.

**Division of labour:** N3 sets the date to its best estimate of the publication date.
**B6 verifies it at merge** and corrects it if the merge slipped. Do not pre-date it,
and do not carry `February 13, 2026` forward. Format stays `Month D, YYYY` — if
publication lands on 2026-08-28, the exact string is `'August 28, 2026'`.

**No user notification is implied.** C4 narrows an overreaching claim; it alters **no
data practice**. Nothing Nahtadi collects, stores, transmits or shares changes, so the
"Changes to This Privacy Policy" section's existing terms ("Any updates … will be
posted on this page with a revised Last Updated date") are fully satisfied by the date
bump alone. No email, no in-app notice, no App Store submission is triggered.

### Privacy metadata

| # | Type | Slot(s) | BEFORE (exact) | AFTER (exact final text) | Chars |
|---|---|---|---|---|---|
| C1 | METADATA | `openGraph.images[0].alt` | `Nahtadi — Islamic Prayer Times` | `Nahtadi - Islamic Prayer Times` | — |
| C2 | METADATA | `openGraph.title` **and** `twitter.title` | `Privacy Policy \| Nahtadi` | `Privacy Policy - Nahtadi` | 24 → 24 |
| C3 | METADATA | `description`, `openGraph.description`, `twitter.description` (all three, identical) | `Privacy policy for Nahtadi, the iOS app. No data collection, fully offline.` | `Privacy policy for Nahtadi, the Islamic prayer times app for iOS. No data collection, fully offline.` | 75 → 100 |

**C2 note:** `metadata.title` stays the bare `'Privacy Policy'` — the parent
`title.template` (B2) resolves it to `Privacy Policy - Nahtadi`. Only the OG and
Twitter titles, which have no template inheritance, spell it out. Both change.

**C3 note:** all three copies of this description are currently byte-identical and stay
byte-identical. `the iOS app` was vague; the replacement carries the keyword phrase
without keyword-stuffing a legal page.

---

## 4. `/nahtadi/support`

**File:** `src/app/nahtadi/support/page.tsx`

### Metadata

| # | Type | Slot(s) | BEFORE (exact) | AFTER (exact final text) | Chars |
|---|---|---|---|---|---|
| D1 | METADATA | `openGraph.title` **and** `twitter.title` | `App Support \| Nahtadi` | `App Support - Nahtadi` | 21 → 21 |
| D2 | METADATA | `openGraph.images[0].alt` | `Nahtadi — Islamic Prayer Times` | `Nahtadi - Islamic Prayer Times` | — |
| D3 | METADATA | `description`, `openGraph.description`, `twitter.description` (all three, identical) | `Support and frequently asked questions for Nahtadi - the Islamic Prayer Times app for iOS.` | `Support and frequently asked questions for Nahtadi, the Islamic prayer times and Qibla app for iOS.` | 90 → 99 |

`metadata.title` stays the bare `'App Support'`, resolved by B2's template.

### Page copy

| # | Type | Location | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| D4 | COPY | Page sub, under the `<h1>` | `Find answers to common questions or get in touch with our support team.` | `Common questions first. If yours isn&apos;t here, email me.` |
| D8 | COPY | Contact Support intro | `Have a question or issue not covered in the FAQ? We&apos;re here to help!` | `Not covered above? Email me.` |
| D9 | COPY | Email Support card body | `Send us an email and we&apos;ll get back to you within 24-48 hours.` | `Email me and I&apos;ll get back to you.` |
| D12 | COPY | Privacy link line, lead-in | `Concerned about privacy?` | `Want the details?` |
| D12 | COPY | Privacy link line, anchor text | `Read our Privacy Policy` | `Read the privacy policy` |
| D13 | COPY | Back link label prop | `Back to Nahtadi App Page` | `Back to Nahtadi` |

**D9 drops the response-time commitment entirely.** `within 24-48 hours` was a
published SLA from a solo developer with no way to enforce it. Not replaced with a
softer SLA — removed.

**D12 is two separate strings on the same line** (the lead-in text node and the anchor
text inside it). Both change.

**D13** changes only the `label` prop passed to `LeadingAffordanceLabel`. The
chevron-left glyph is already correct per grammar v2 and is untouched.

### FAQ answers

| # | Type | FAQ | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| D5 | COPY | Does Nahtadi require an internet connection? | `No, Nahtadi works completely offline once installed. All calculations are performed locally on your device using astronomical algorithms. The app does not require internet access for any functionality.` | `No. Nahtadi works completely offline once installed. All calculations run locally on your device using astronomical algorithms.` |
| D6 | COPY | Can I use Nahtadi anywhere in the world? | `Yes! Nahtadi works worldwide.` (first sentence only) | `Yes. Nahtadi works worldwide.` |
| D7 | COPY | The prayer times seem incorrect… (closing clause) | `with the following information: the date, your location (city, state, country), your timezone, and what the prayer times should be for that date.` | `with the date, your location (city, state, country), your timezone, and what the times should have been.` |
| D15 | COPY | Is my data private? (closing clause) | `See our` | `See the` |

**D6 replaces the first sentence only.** The rest of that answer — ±48.5 degrees,
the method list, automatic selection — is technical and stays verbatim.

**D7 replaces the closing clause only.** Everything before it, including the
`Settings → Nahtadi → Location` path and the whole troubleshooting sequence, is
untouched. The prefilled `mailto:` body on the same element is also untouched.

**D15 is the row the audit table missed.** The exhaustive `we|our|us` grep run after
the ruling found it: `See our Privacy Policy for complete details.` It is a pointer
sentence, not a data commitment, so the F1 plural-voice ruling applies to it the same
way it applies to D12. Listed as its own row rather than folded in silently. **The rest
of that FAQ answer is UNCHANGED** — it restates the privacy policy and falls under the
same no-restructure rule as the policy itself (see §6).

### Technical Information block

| # | Type | Row | Action |
|---|---|---|---|
| D10 | COPY | `App Version` / `v1.1.0` | **Delete the entire `<div>` containing that `<dt>`/`<dd>` pair.** |
| D11 | — | `Developer` / `Omar Saed Younis` | **KEEP VERBATIM.** See §6. |

**Why D10:** already stale; the only row that changes per release; a static site cannot
self-update; and a wrong version actively misleads a user trying to report a bug.

**N3 layout note (not a copy decision):** the `<dl>` is `grid-cols-1 sm:grid-cols-2`,
so removing one of four items leaves three, and the last cell goes empty at the `sm`
breakpoint. Either accept the ragged cell or reflow — N2's call, not this document's.

---

## 5. Sitewide descriptions — secondary sweep

Two changes, both metadata, both outside the Nahtadi family.

| # | Type | File | BEFORE (exact) | AFTER (exact final text) | Chars |
|---|---|---|---|---|---|
| G1 | METADATA | `src/app/about/page.tsx` `DESCRIPTION` | `From seven years in mechanical engineering to shipping iOS apps, machine learning, and autonomous systems work. M.S. Computer Science, CSU Fullerton.` | `Seven years in mechanical engineering, then a full retrain: a shipped iOS app, machine learning, autonomous systems. M.S. Computer Science, CSU Fullerton.` | 149 → 154 |
| G2 | METADATA | `src/app/projects/page.tsx` `DESCRIPTION` | `Selected work by Omar Younis: a shipped iOS app in Swift and SwiftUI, CUDA scientific computing, machine-learning models, and radar and data tooling.` | `Selected work by Omar Younis: a shipped iOS app in Swift and SwiftUI, CUDA scientific computing, machine-learning models, radar and data tooling.` | 149 → 145 |

**G1 fixes two things.** The plural `iOS apps` contradicted the canonical fact (one
shipped app, Nahtadi) *and* contradicted the Home description written in the same B5
pass, which says `a shipped iOS app`. Both descriptions now say the same true thing.
The broken parallel is also gone: `to shipping iOS apps, machine learning, and
autonomous systems work` parsed as "shipping machine learning".

`M.S. Computer Science, CSU Fullerton` is preserved in full — the degree is a canonical
fact and `Computer Science` is a keyword phrase, so it was not abbreviated to fit.
`a full retrain` echoes About's own locked hero copy (`So I retrained, properly.`).

**Both G1 and G2 are single `const DESCRIPTION` declarations** reused for
`description`, `openGraph.description` and `twitter.description`. One edit each; the
three slots follow automatically. Do not inline them.

---

## 6. Deliberately UNCHANGED — exemption register

**Everything in this section was examined and ruled to stay.** Each line records its
reason so a later pass does not "fix" it. If a future task wants to change one of
these, that is a new decision for Omar, not a cleanup.

### The privacy policy

| What | Why it stays |
|---|---|
| **The entire policy body**, apart from C4's single sentence | It makes commitments about data handling, and Apple requires the App Store privacy-policy URL to match the app's actual practices. Rewriting it for voice is a category error: restructured sentences quietly change what is being promised. |
| **Formal register throughout** | Correct for a legal document. Cadence rules do not apply here. |
| **Plural voice — `we`, `us`** (`We recommend checking this page periodically`, `please contact us`) | Deliberate and ruled. Legal register is conventionally plural. The F1 first-person switch applies to `/nahtadi` and `/nahtadi/support` **only**, and stops at this file's border. |
| **`NOT` and `NEVER` in block capitals** (`does NOT collect`, `Is NEVER transmitted`) | Emphasis in a commitment document. Not a style defect. |
| **Section headings** — Overview, Data Collection, Data Storage, Location Services, Third-Party Services, Children's Privacy, Changes to This Privacy Policy, Contact | Structure a reviewer scans for. Unchanged. |

### Literal iOS UI notation

| What | Why it stays |
|---|---|
| **`Settings → Nahtadi → Location`** — `privacy/page.tsx` and `support/page.tsx` | These arrows are **literal iOS UI path notation**, not link affordances. Grammar v2 governs links and pills; it does not govern a description of a settings path a user has to follow on their phone. Both occurrences are **exempt from the Unicode-arrow ban** that removed E1. Do not swap them for glyphs, do not reword the paths. |

### Kept on `/nahtadi`

| What | Why it stays |
|---|---|
| **Hero sub:** `Accurate prayer times and Qibla direction. No ads. No tracking. Just salat.` | The brand line. Carries the `Qibla` keyword. Reads clean. |
| **`Why Nahtadi?` sub:** `Most prayer apps are free because you are the product. Nahtadi isn't.` (with `<em>` on `you`) | Strong, specific, and the sharpest sentence on the page. |
| **All five "Why" cards** — No Ads, No Data Collection, One-Time Purchase, Works Offline, Muslim-Built, and their descriptions | Concrete, already terse. `By a Muslim developer, for the Ummah.` is deliberate. |
| **`<h2>` values:** `Why Nahtadi?`, `Everything You Need for Salat`, `App Preview`, `Frequently Asked Questions` | Only the two headings in A15/A19 were defective. |
| **All eight feature-card `title` values** and all six screenshot `title` values | Only descriptions/captions changed. |
| **Feature: `Accurate calculations for Fajr, Dhuhr, Asr, Maghrib, and Isha using astronomical algorithms.`** | Concrete and correct. |
| **Screenshots: Prayer Times, Qibla Compass, Settings captions** | Accurate and specific; no AI cadence. |
| **`Questions or feedback?`** + the `support@hendaseh.com` mailto | Fine as written. |
| **`aggregateRating` in JSON-LD** (5.0 / 7 after H1, from `projects.json`) | Matches the visible ratings badge, so it satisfies the structured-data guideline. Data-layer sourced; never hardcode it. |
| **`offers` in JSON-LD** (`'@type': 'Offer'`, `price: '3.99'`, `priceCurrency: 'USD'`) | **Looks like dead weight; is not.** Google's SoftwareApplication rich result needs name + `offers` + `aggregateRating` **together**, so deleting `offers` silently kills the star rating in search along with the price. Kept deliberately. Row A1 now states the price in visible content, so the markup represents something a user can see. `offers.price` and A1's `$3.99` move together, always. Full reasoning in §2 (F6) and §7. |
| **`keywords` array** in `layout.tsx` | Untouched. |
| **`alt="Nahtadi App Icon"`** on the hero icon | Adequate alt text. Not worth churn. |

### Kept on `/nahtadi/support`

| What | Why it stays |
|---|---|
| **FAQ 1** (how to change the calculation method) — entire answer | Technical instructions describing real iOS UI. Literal accuracy outranks concision. |
| **FAQ 2** (prayer times incorrect) — everything except D7's closing clause | Same. Includes the settings path and the prefilled `mailto:` body. |
| **FAQ 3** (notifications) — entire answer, including the 10-day scheduling and day-9 reminder detail | Accurate behavioural detail a user needs. |
| **FAQ 5** (Qibla calculation) — entire answer | Technical and accurate: GPS, spherical trigonometry, magnetometer, the Qibla tab. |
| **FAQ 7** (is my data private) — entire answer except D15's two-word pointer fix | It restates the privacy policy. The policy's no-restructure rule extends to any text that mirrors it. **`Absolutely.` stays** even though it is a one-word affirmation — see below. |
| **FAQ 8** (Hijri and Gregorian dates) — entire answer | Accurate; its `-` is a hyphen, not an em dash. |
| **All eight FAQ `question` strings** | Unchanged. Only answers moved. |
| **`Platform` / `iOS` and `Requirements` / `iOS 17.0+`** rows | Kept per ruling. `iOS 17.0+` also drifts per release but far more slowly than a version number, and it is information a user actually needs before downloading. |
| **`Developer` / `Omar Saed Younis`** | **KEEP VERBATIM.** This is exactly what the App Store listing shows, and a user cross-referencing the two needs them to match. It is not an inconsistency with the site's `Omar Younis` — it is the legal name in the one place the legal name belongs. |
| **`Email Support` card heading**, the `support@hendaseh.com` address and its `mailto:` subject | Unchanged. |

### One-word affirmations

The audit flagged five one-word FAQ openers across the family as tonal uniformity:
`Yes.` `Completely.` `No,` `Yes!` `Absolutely.` **Two were broken** — A4 removed
`Completely.` and D6 changed `Yes!` to `Yes.` **Three deliberately remain:**

- `Yes.` on `/nahtadi`'s "Is my data safe?" — a direct question deserves a direct yes.
- `No.` on `/support`'s internet question (D5 changed the comma to a period, not the word).
- `Absolutely.` on `/support`'s privacy question — inside an answer that mirrors the policy.

Breaking all five would have been over-correction. Do not "finish the job".

### Elsewhere

| What | Why it stays |
|---|---|
| **Em dashes inside JSX comments** — 5 across the family | Not user-visible. Ruled: leave. |
| **Home description** (`src/app/page.tsx`, 148 chars) | Swept and clean. |
| **Contact description** (`src/app/contact/page.tsx`, 125 chars) | Swept and clean; sized to survive the ~125-char social preview cut. |
| **All URLs, canonical tags, `alternates`, `robots`, sitemap entries, redirects** | No route or slug changes anywhere in this document. |
| **`siteName: 'Nahtadi'`** on all three pages | Load-bearing for B2's rationale. |
| **`/og/nahtadi.png`** — the card image itself | No gradient or card-copy change, so no `npm run generate:og` needed for the Nahtadi family. |

---

## 7. Proposed and DROPPED — do not re-propose

| From | Proposal | Why it was dropped |
|---|---|---|
| Audit G3 | Rewrite the **Home** description for an uneven list (`a shipped iOS app` / `machine learning` / `autonomous systems work`) | Real but minor, and not worth churning an approved B5 string. The plural contradiction it was paired with is fixed on About's side instead (G1). |
| Audit G4 | Any change to the **Contact** description | Nothing wrong with it. Swept, clean, closed. |
| Audit A14 alt | `A look at the app, screen by screen.` / `The screens you will use every day.` | Lost to `Six screens from the app.` — concrete count beats a gesture. |
| Audit A15 alt | `Privacy, in detail.` | Lost to `Nothing leaves your device.` — a claim beats a label. |
| E1 alt (b) | Swap `Scroll to see more →` for the self-drawn **chevron-right** | Grammar v2 assigns chevron-right to internal navigation. This is neither navigation nor a link; reusing the glyph would corrupt a locked vocabulary. |
| E1 alt (c) | Mint a **sixth** affordance glyph for horizontal scroll | Not worth a new family member for a hint line. |
| D9 alt | Keep a softer SLA: `…usually within a couple of days.` | Dropped with the SLA itself. No response-time promise is published. |
| C4 alt | Cite the **App Store 4+ age rating** in the privacy policy | 4+ is a **content** rating. Using it to support a data claim re-imports the exact category error C4 exists to remove. Explicitly rejected. |
| F2 | `Choose from 9+ calculation methods for your region.` | The count is unconfirmed. A *confirmed* number may return later (see §1); `9+` may not. |
| **A19 (STRUCK 2026-08-28)** | Rewrite the newsletter heading `Stay in the Loop` → `Updates by email` | The section is deleted by H2. Do not restore the heading, and do not restore the section it headed. |
| **A20 (STRUCK 2026-08-28)** | Rewrite the newsletter sub → `Get an email when a new version ships.` | Same: H2 deletes the section. This one is worth noting for a second reason — it promised a mailing that was never going to be sent. |
| **A21 (STRUCK 2026-08-28)** | Rewrite `EmailSignup.tsx`'s success message → `You're on the list.` | H2 deletes the component file. The audit's separate worry that this message could display after a *failed* subscribe (opaque `no-cors` response) is resolved by deletion rather than by wording. |
| **F6 (original ruling, STRUCK 2026-08-28)** | **Delete the `offers` block from the SoftwareApplication JSON-LD**, because `3.99` appeared only in markup and nowhere visible | **Do not re-propose this.** Google's SoftwareApplication rich result requires **name + `offers` + `aggregateRating` together**. Deleting `offers` drops the page out of rich-result eligibility entirely and **takes the 5.0 star rating with it** — a search regression on the one page whose SEO must not regress, in exchange for tidying a field nobody sees. The premise was right (markup must represent visible content) and the fix was backwards: **row A1 makes the price visible instead.** A future reader will find `offers` carrying a price that duplicates the FAQ and think it redundant. It is not; it is half of the rich-result contract. See §2 (F6) and §6. |
| F6 partial | Remove only `price` and `priceCurrency`, keep `offers` | Moot now that `offers` stays whole, and it was never viable on its own: it leaves an Offer with no price — invalid structured data, and worse than either alternative. |
| Audit C6 (original) | Keep `Last Updated: February 13, 2026` | Void. It was conditioned on zero policy-body changes; C4 changes the body. The date now moves — see §3. |

---

## 8. SEO ledger

**Hard constraint:** `/nahtadi`'s SEO must not regress. Nothing below is a net loss.

### Keyword phrase survival

| Phrase | Where it survives after this change |
|---|---|
| **Islamic prayer times** | `/nahtadi` title (×3 slots) · `/nahtadi` description (×4 slots, **newly present**) · privacy description (**newly present**) · support description · `keywords` array · JSON-LD `description` |
| **Qibla** | `/nahtadi` description (×4 slots, **newly present**) · support description (**newly present**) · hero sub · feature-card title `Qibla Direction` · screenshot title `Qibla Compass` · section sub A13 (**newly present**) · support FAQ 5 · `keywords` array |
| **iOS** | `/nahtadi` description (×4 slots, **newly present**) · privacy description · support description · JSON-LD `operatingSystem: 'iOS'` · support Technical Information · `keywords` array |
| **offline** | `/nahtadi` description (×4 slots) · privacy description · feature-card title `Fully Offline` · screenshot title `Offline Mode` · FAQ A4 · support FAQ D5 (twice) · `keywords` array |
| **privacy** | `/nahtadi` section A15/A16 + privacy card A17 · privacy page title, description and body · support FAQ 7 and D12 |
| **prayer times / Salat / Fajr Dhuhr Asr Maghrib Isha** | Unchanged across headings, feature cards, FAQs and `keywords` |
| **one-time purchase** | `/nahtadi` description (×4) · "Why" card · FAQ A1 |
| **Swift / SwiftUI / SwiftData** | `keywords` array · privacy body (SwiftData, ×2) · support FAQ 7 |

**Net additions:** `Qibla` and `iOS` enter the `/nahtadi` descriptions for the first
time (previously in `keywords` only). `Qibla` enters the support description.
`Islamic prayer times` enters the privacy description. **Net removals: none.**

### Description character counts (limit 160)

| Surface | Before | After | Status |
|---|---|---|---|
| `/nahtadi` — `description`, `og`, `twitter`, JSON-LD (one string, 4 slots) | 142 / 132 / 95 / 132 | **153** | ✅ under 160; three variants collapse to one |
| `/nahtadi/privacy` — all 3 slots | 75 | **100** | ✅ |
| `/nahtadi/support` — all 3 slots | 90 | **99** | ✅ |
| `/about` — `DESCRIPTION` (3 slots) | 149 | **154** | ✅ |
| `/projects` — `DESCRIPTION` (3 slots) | 149 | **145** | ✅ |
| `/` (home) — `DESCRIPTION` (3 slots) | 148 | 148 | unchanged |
| `/contact` — `DESCRIPTION` (3 slots) | 125 | 125 | unchanged; sized for the ~125-char social cut |

### Title character counts

| Surface | Before | After |
|---|---|---|
| `/nahtadi` (×3 slots) | 52 | **52** |
| `/nahtadi/privacy` OG/Twitter | 24 | **24** |
| `/nahtadi/support` OG/Twitter | 21 | **21** |

### Structural SEO — unchanged

- No URL, slug, canonical tag, `alternates`, `robots` directive, sitemap entry or
  redirect is touched anywhere in this document. The three frozen URLs stay frozen.
- JSON-LD `description` stays aligned with the page description (B3 ↔ B6, enforced by
  shipping them together).
- FAQPage JSON-LD updates automatically from the `faqs` array — no drift possible.
- `aggregateRating` stays data-layer sourced and matches visible content. **H1 changes
  `ratingCount` 8 → 7.** That is a *correction*, not a regression: 8 matched no source,
  and Google reads this field. `ratingValue` stays 5.0. A lower count does not affect
  rich-result eligibility — only the presence of `aggregateRating` does.
- **H2 removes no indexable content.** The newsletter section carried no keyword the
  page needs: its heading and sub were about email updates, not prayer times, Qibla,
  iOS, offline or privacy. Nothing in §8's phrase table depends on it. The one link
  lost is the outbound `@Hendaseh` Instagram link — see H2's flag in §1.
- **`offers` is retained, and rich-result eligibility is preserved.** The
  SoftwareApplication rich result needs name + `offers` + `aggregateRating` together;
  all three remain. Guideline compliance improves without touching the markup, because
  **row A1 moves the price into visible content** — the mismatch is resolved from the
  copy side, at no cost to the star rating in search. This is a net SEO *gain*: the
  page keeps its rich result and stops asserting an invisible price.
- OG card images unchanged, so no `npm run generate:og` run is required.

---

## 9. Gates and notes for N3

### Required work beyond the copy tables

1. **Delete the newsletter (row H2).** Three things: the `Stay in the Loop`
   `<section>` in `src/app/nahtadi/page.tsx`, the `EmailSignup` import at the top of
   that file, and `src/components/nahtadi/EmailSignup.tsx` itself. Check whether N2 has
   rehoused the `@Hendaseh` Instagram link that lives inside that section — if not, it
   goes with it.
2. **Set `appStoreRating.count` to `7` (row H1)** in `src/data/projects.json`. One
   field; the badge, the reviews section and the JSON-LD `ratingCount` all follow.
3. **Set the policy's `Last Updated` to the publication date**, not the day N3 runs.
   B6 verifies it at the dev → main merge (§3).

### Blocking gates — settle before the work ships

- **Ratings count: the number is 7, and the source is Apple's public lookup API on the
  US storefront** (§10, verified 2026-08-28). **Do not "correct" it to 9.** App Store
  Connect's 9 is the worldwide total and is unreachable from the API sub-project 5 will
  automate against. The reasoning is at H1; read it before changing the number.
- **App Store price: gate CLOSED.** `$3.99` is confirmed against source (§10), so row
  A1 ships as written. Recorded rather than deleted so the check is not repeated.

### Note for B6 — verify, do not edit

**Two files make claims about this, and only one of them was actually false.**

**`docs/ROADMAP.md`, Standing notes — FALSE since 2026-08-24, true again after H2:**

> the contact form and **Resend are decommissioned** (2026-08-24), so the site has no
> server-side mutation, no secret, and **no runtime third-party dependency**.

That last clause has been wrong for the whole of sub-projects 3 and 4.
`EmailSignup.tsx` POSTs to `buttondown.com` at runtime — a third-party dependency by
any reading. The bullet was written when Resend came out and nobody checked the one
page that still called a third party. **H2 makes it true.** B6 confirms and leaves the
wording alone; it needs no edit once the form is gone.

**`.claude/CLAUDE.md:133` — never false, but incomplete.** It says:

> There is **no contact form, no server action, no API route, and no runtime secret**.
> The app reads no environment variables — a fresh clone needs no `.env.local`.

**Read literally, `EmailSignup.tsx` never falsified those clauses.** It is a
*client-side* POST from a `'use client'` component, so it is not a server action and
not an API route, and Buttondown's embed endpoint takes no key, so it is not a runtime
secret or an environment variable. Every listed claim survived it.

**What the section does not have is any line about client-side third-party calls at
all.** That is the actual gap: the passage paints a site that talks to nothing, and
since sub-project 2 the site has been POSTing an email address to `buttondown.com` from
the browser. It went unnoticed because the form lived on the one page nobody had
audited. After H2 the picture and the prose agree.

**B6 VERIFIES rather than edits — both files.** Grep `src/` for `fetch(`,
`buttondown`, and any other outbound client-side call, then confirm that ROADMAP's
Standing notes bullet and CLAUDE.md's stack section both describe reality. Neither
needs rewriting once H2 lands. If B6 judges CLAUDE.md should *add* an explicit line
about client-side third-party calls, that is a proposal for Omar — not a silent
correction, and not something to retro-fit as though it had always been there.

**If anything still contradicts either claim, that is a finding for Omar, not a doc
edit.** The failure mode here was a document asserting a property nobody re-checked;
fixing it by editing the document rather than the code would repeat it.

### Open question for Omar — raised, not implemented

**Add a `verifiedOn` date to `projects.json`'s `appStoreRating` block?**

```
"appStoreRating": { "value": "5.0", "count": 7, "verifiedOn": "2026-08-28" }
```

**The case for it:** the count reached 8 by drifting silently, and nothing in the repo
recorded when it was last true. A date makes staleness *visible* — a reader can see the
number is six months old without having to check Apple. It costs one schema field
(`projectSchema.ts` is strict, so it must be declared) and one line of discipline.

**The case against:** it is a stopgap. Sub-project 5's App Store fact sync (see
`docs/ROADMAP.md`) replaces the need entirely, and a hand-maintained freshness stamp
can itself go stale — a `verifiedOn` nobody updates is worse than no field, because it
asserts a check that did not happen.

**Omar's call.** Not implemented either way. If yes, it is a schema change plus a test,
and it should land with H1 so the first stamp is honest.

### Not blocking — recorded so they are decisions, not oversights

None of the following are approved changes; each needs its own ruling if acted on.

1. **`support/page.tsx:188` uses a raw `<a href="/nahtadi/privacy">`** where line 81
   uses `<Link>` for the same internal route. Cheap consistency fix if N3 is in the
   file anyway.
2. **`iOS 17.0+`** drifts per release like the version row did, just far more slowly.
   Verified correct on 2026-08-28 (§10) and kept deliberately; worth a periodic check
   rather than a mechanism — or, better, sub-project 5's sync.
3. **Verification before commit:** build, unit tests, e2e and lint must all pass. The
   e2e suite already guards the frozen URLs and redirects; B1/B2 change title *text*
   only, so no redirect is implied, but run `npm run test:all` and confirm rather than
   assume. **H1 and H2 both touch tested surfaces** — `projectStyles.test.ts` and
   `projects.test.ts` read the data layer, and deleting a component changes the page
   tree. Run them, do not assume.

*(The audit's old note that `EmailSignup.tsx` "may be lying" about subscribe success is
resolved by H2 and now lives in §7 under the struck A21.)*

---

## 10. App Store facts — verified against source, 2026-08-28

**Sources:** `https://itunes.apple.com/lookup?id=6755970888` (Apple's public lookup
API, no auth, US storefront) and App Store Connect.

This ledger exists because three of these had silently drifted before anyone checked.
Anything below that a future task wants to change should be re-verified against these
sources first, not reasoned about.

| Fact | Source value | Where it lives | Status |
|---|---|---|---|
| **Price** | `$3.99` | `offers.price` in JSON-LD; **now also visible** in A1 | ✅ CONFIRMED. Amendment 1's blocking gate is closed; A1 ships as written. |
| **`sellerName`** | `Omar Saed Younis` | `/nahtadi/support` Technical Information | ✅ CONFIRMED verbatim. **D11 stands** — it matches the App Store listing exactly, which is the whole reason it differs from the site's `Omar Younis`. |
| **`averageUserRating`** | `5.0` | `projects.json` `appStoreRating.value`; badge; JSON-LD `ratingValue` | ✅ CONFIRMED on both sources. Unchanged. About's locked copy, the Home ticker and the flagship meta line are unaffected. |
| **`userRatingCount`** | `7` (US storefront) / `9` (App Store Connect, worldwide) | `projects.json` `appStoreRating.count`; badge; JSON-LD `ratingCount` | ⚠️ **8 → 7 by H1.** Stored value matched neither source. See H1 for why 7 beats 9. |
| **`minimumOsVersion`** | `17.0` | `/nahtadi/support` Technical Information (`iOS 17.0+`) | ✅ CONFIRMED. The row is correct and **stays** (§6). |
| **`contentAdvisoryRating`** | `4+` | **Nowhere, deliberately** | ✅ CONFIRMED as a fact — and still **explicitly REJECTED** for the privacy policy (§7). It is a **CONTENT** rating; citing it to support a data claim re-imports the exact category error C4 exists to remove. Confirming it does not license using it. |
| **`version`** | `1.2.1` | `/nahtadi/support` showed `v1.1.0` | ⚠️ **Two releases stale.** No action needed — **D10 removes the row.** Recorded because this is the evidence *for* removal rather than maintenance: the row was wrong, and nobody noticed. |

**Drift found: three of seven.** The count, the version, and (as an unverifiable
assertion) the price. That ratio is the argument for the sub-project 5 automation, and
it is why H1 optimises for a field that stays right over one that is momentarily
truer.
