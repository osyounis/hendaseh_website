# About — APPROVED design contract (M3, 2026-08-27)

**Approved mockups (visual contract for Task B3):**
- `v9.html` — dark (canonical) · `v9-light.html` — light companion (v8 pair superseded: light-theme heading fix, connector contrast, pill-ground rule, .when contrast floor)
- History: v1 → v8 across Omar's copy workshop + review rounds; superseded files kept.

## Copy is LOCKED VERBATIM

The copy in v8 went through a multi-round workshop with Omar and is locked word-for-word — the build lifts it verbatim from the mockup. Highlights of what the workshop settled (do not re-litigate in build):

- Hero: `I build software people rely on.` ("rely on" over "trust" — deliberate). Intro ends "…seven years as a mechanical engineer. Now I'm pointed at AI and autonomous systems."
- Arc chapters: MECHANICAL (`It started with a V8 engine.` — father taught mechanical design and engineering, age six, 1/8-scale V8) → SOFTWARE (`So I retrained, properly.` — no GPA anywhere) → WHAT'S NEXT (`Next: AI and autonomous systems.`).
- **Fact rules:** résumé (docs/content/Omar_Younis_Resume.pdf) is master source of truth, wins all conflicts. Coast Guard: reporting tools "run at every U.S. Coast Guard air station"; the collision trainer was BUILT (never "used by CG"); the TypeScript rebuild is mentioned, the potential sale is NOT (pre-negotiation). Medal: "awarded by the Commandant," never the award's rank. Qualcomm: résumé framing only, no client claims. VOLUNTEER badge on the CG highlight card is mandatory.
- No em dashes, no AI cadence (sitewide rule).

## Layout & rules this page produced (sitewide where noted)

- Hero: text left, photo right (`public/profile.jpg`, 28px radius, dashed accent ring, NO location chip — Sunnyvale lives in the intro only). CTAs: `Résumé (PDF)` primary + `Get in touch`.
- Arc: dotted vertical timeline; **radar-blip nodes** — dot pops in on reveal, then `::after` ring pulses: 3s cycle, scale 1→2.6, opacity .7→0, strong ease-out, infinite; static under reduced motion.
- Section headings: statement headlines ONLY on narrative beats; list sections get plain headings (`Career highlights`, `Education`, `Off the clock`). **Never render an eyebrow identical to its heading.** (sitewide)
- Beyond the code is a full section with two cards (Auxiliary volunteer/SAR since 2015 + languages/places/certs). No school logos — no third-party marks in the design system. (sitewide)
- Reveals: sections rise 20px/600ms, trigger at threshold .25 with -60px bottom margin (must be seen, not pre-fired); reveal uses the `translate` property so it NEVER conflicts with hover `transform`. (sitewide)
  - **As-built divergence, ruled during B3 and approved 2026-08-27 — do NOT "fix" the code back to the two numbers above.** The rise, the duration and the `translate` property shipped exactly as written; the **observer parameters did not**. `ScrollReveal.tsx` keeps its `-80px` bottom margin and sets **no threshold**, and that is deliberate:
    - `-80px` fires *later* than `-60px`, so it honours "must be seen, not pre-fired" more strictly than the contract asks. Nothing is lost by keeping it.
    - `threshold: .25` would destabilise the component's deliberate **`9999px` asymmetric top root margin**, which is the guarded fix for jump-past-a-section reveals (a Home/End keypress or an in-page anchor carries an element from below the fold to above the viewport in one frame, crossing no threshold, and the section stays invisible for the rest of the visit). Making "already scrolled past" an intersecting state is what repairs that; a 25% ratio gate reintroduces the failure for any section taller than a quarter viewport.
    - The `translate`-not-`transform` half of this bullet is the load-bearing half and is non-negotiable: About's cards are `.home-tile`, whose hover IS a `transform`, and B3 shipped a `.home-tile[data-reveal="in"]` compound rule because the reveal's `transition` shorthand was otherwise replacing the tile's and killing its 280ms hover.
- **Card hover is SHARED CODE, not a spec to re-implement:** B3 applies the existing built `.home-tile` class/tokens (ease-brand 280ms, -6px, tile-hover tokens) to About's cards. Same rule binds **B2 for the projects page cards** per Omar's explicit instruction. Parity is structural, never approximated. (sitewide)
- Phone (sub-880): stacked hero (photo 220px below text), inline timeline dots, single-column cards, stacked CTAs.

- Focus visibility: B3 reuses the built `.home-tile:focus-visible` outline pattern on all interactive cards/pills. (sitewide)

## Build notes for B3

- Résumé link `download="Omar_Younis_Resume.pdf"` identical to every other instance; serve the Aug 2026 master (replace `public/omar_younis_resume_2026.pdf` content per audit item D.3 if not already done).
- Playwright: download attr, heading order, reveal + reduced-motion (static) checks.
- Both themes per the pair; light follows the Apple gray ladder tokens already in globals.
