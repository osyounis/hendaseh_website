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

## Audit ID traceability

Row IDs match the N1 audit table so approvals can be traced back. Two notes:

- The audit's **F3** was the "Always accurate" screenshot caption and **F6** was the
  JSON-LD price. Omar's ruling message labelled the price ruling "F3". Both are
  approved and both appear below, under their **original audit IDs** (F3 = caption,
  F6 = price). No row was lost to the renumber.
- **D15 is new.** An exhaustive `we|our|us` grep after the ruling found an eighth
  plural-voice occurrence that the audit table missed. It is listed rather than
  applied silently — see §4.

---

## 1. `/nahtadi` — page copy

**File:** `src/app/nahtadi/page.tsx` (all rows in this section)

**Propagation note:** rows A1–A4 live in the `faqs` array (lines 20–37). `faqLd` is
built from that array by `.map()`, so the FAQPage JSON-LD updates automatically. Do
not hand-edit `faqLd`.

### FAQ answers

| # | Type | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|
| A1 | COPY | `Many prayer apps are "free" because they make money from ads and your data. Nahtadi is a one-time purchase because we believe your worship shouldn't be monetized. No ads means no incentive to track you. One payment means we don't nag you with subscription prompts during salat.` | `Many prayer apps are free because they make money from ads and your data. Your worship should not be a revenue stream. Nahtadi is a one-time purchase: no ads, so there is nothing to gain from tracking you, and no subscription prompts arriving in the middle of salat.` |
| A2 | COPY | `Yes. Nahtadi collects zero personal data. Everything — your location, settings, and preferences — stays on your device. There are no analytics, no third-party trackers, and no accounts to create.` | `Yes. Nahtadi collects zero personal data. Your location, settings, and preferences stay on your device. There are no analytics, no third-party trackers, and no accounts to create.` |
| A3 | COPY | `Nahtadi supports all major calculation methods including ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), Egyptian General Authority (EGAS), and more — with high-latitude adjustments for extreme latitudes.` | `Nahtadi supports the major calculation methods: ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), the Egyptian General Authority (EGAS), and others. It also applies high-latitude adjustments beyond 48.5 degrees north or south, where the standard methods can fail during certain seasons.` |
| A4 | COPY | `Completely. Prayer times are calculated on-device using astronomical algorithms, so Nahtadi works offline anywhere in the world once installed.` | `Prayer times are calculated on your device using astronomical algorithms, so Nahtadi works offline anywhere in the world once installed.` |

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
| A19 | COPY | Email section `<h2>` | `Stay in the Loop` | `Updates by email` |
| A20 | COPY | Email section sub | `Get notified about new features and updates.` | `Get an email when a new version ships.` |

**Section `<h2>` values NOT listed here are unchanged:** `Why Nahtadi?`,
`Everything You Need for Salat`, `App Preview`, `Frequently Asked Questions`. See §6.

**A13/A14 add terminal periods** where the originals had none. That is part of the
locked text, not a typo to normalise away.

**A16 wording is load-bearing:** "collects nothing and transmits nothing" is phrased to
match the privacy policy's own "does NOT collect, transmit, or share any personal
information". If the policy ever changes, this line changes with it.

### Cards, badge and signup

| # | Type | Location | BEFORE (exact) | AFTER (exact final text) |
|---|---|---|---|---|
| A17 | COPY | Privacy Policy card body | `Learn how Nahtadi protects your privacy with no data collection.` | `What Nahtadi stores, what it never sends, and how to revoke location access.` |
| A18 | COPY | App Support card body | `Have questions? Check our FAQ or contact our support team.` | `Setup, calculation methods, notifications, and how to reach me.` |
| A22 | COPY | Ratings badge | `{project.appStoreRating.value}★ · {project.appStoreRating.count} Ratings on the App Store` | `{project.appStoreRating.value}★ · {project.appStoreRating.count} ratings on the App Store` |
| A21 | COPY | `src/components/nahtadi/EmailSignup.tsx` success message | `You&apos;re in! We&apos;ll keep you posted.` | `You&apos;re on the list.` |

**A22 is a one-character change** (`Ratings` → `ratings`). The two JSX expressions are
untouched — the numbers stay sourced from `projects.json` via the data layer.

**A21 is in a different file** (`EmailSignup.tsx`, not `page.tsx`) and keeps its JSX
entity encoding: `You&apos;re on the list.`

**A17 accuracy:** the three things named — what is stored, what is never sent, how to
revoke location access — are each an actual section of the privacy policy. If the
policy's sections change, this line changes with them.

### Deleted line

| # | Type | Location | BEFORE (exact) | AFTER |
|---|---|---|---|---|
| E1 | COPY | Below the "App Preview" sub | `<p className="text-sm text-gray-500">Scroll to see more →</p>` | **Delete the entire `<p>` element.** |

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
| F6 | METADATA | `jsonLd.offers` in `page.tsx` | `offers: { '@type': 'Offer', price: '3.99', priceCurrency: 'USD' }` | **Delete the entire `offers` property.** |

**Delete the whole block, not just the two fields.** Removing `price` and
`priceCurrency` leaves `offers: { '@type': 'Offer' }` — an Offer with no price, which
is invalid structured data and worse than no offer at all. The mechanical instruction
is: remove the `offers` key and its object.

**Why:** `3.99` appears **only** in this JSON-LD and nowhere in visible page content.
That is a structured-data guidelines mismatch — markup must represent content the user
can see — and because it is machine-read it reaches Google directly, so it goes stale
silently on any price change or sale. The **pricing model** is what the page actually
communicates (`One-Time Purchase` card, the "Why isn't it free?" FAQ, and the locked
description's "One-time purchase"), and all of that is visible and stays.

The `aggregateRating` block is **UNCHANGED** — it is sourced from
`projects.json` (`appStoreRating`, 5.0 / 8) and matches the visible ratings badge, so
it satisfies the same guideline that the price failed.

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

Set it to the actual merge date. If N3 merges on 2026-08-28, the exact string is
`'August 28, 2026'`. Do not pre-date it and do not carry `February 13, 2026` forward.

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
| **`aggregateRating` in JSON-LD** (5.0 / 8, from `projects.json`) | Matches the visible ratings badge, so it satisfies the structured-data guideline that F6's price failed. Data-layer sourced; never hardcode it. |
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
| F6 partial | Remove only `price` and `priceCurrency`, keep `offers` | Leaves an Offer with no price — invalid structured data. The whole `offers` block goes. |
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
- `aggregateRating` stays data-layer sourced and matches visible content.
- `offers` removal *improves* guideline compliance (markup must represent visible
  content); it removes a rich-result eligibility that was invalid to begin with.
- OG card images unchanged, so no `npm run generate:og` run is required.

---

## 9. Notes for N3 — not copy, not blocking

Recorded so they are decisions rather than oversights. None of these are approved
changes; each needs its own ruling if acted on.

1. **`EmailSignup.tsx` may be lying.** It posts to Buttondown with `mode: 'no-cors'`
   and sets `success` on any non-network outcome. An opaque response cannot confirm the
   subscribe worked, so A21's `You're on the list.` can display after a failed
   subscribe. Copy cannot fix this; it needs a real success signal or a hedged message.
2. **`support/page.tsx:188` uses a raw `<a href="/nahtadi/privacy">`** where line 81
   uses `<Link>` for the same internal route. Cheap consistency fix if N3 is in the
   file anyway.
3. **`iOS 17.0+`** drifts per release like the version row did, just far more slowly.
   Kept deliberately; worth a periodic check rather than a mechanism.
4. **Verification before commit:** build, unit tests, e2e and lint must all pass. The
   e2e suite already guards the frozen URLs and redirects; B1/B2 change title *text*
   only, so no redirect is implied, but run `npm run test:all` and confirm rather than
   assume.
