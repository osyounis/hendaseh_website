import type { ReactNode } from 'react';

/**
 * Link-affordance grammar v2 -- the ONE definition of the four affordance
 * glyphs and of the rule that glues them to a label.
 *
 * Contract: `docs/superpowers/mockups/contact/APPROVED.md`, section
 * "Link-affordance grammar v2 (SITEWIDE LAW)". Apple's own symbol semantics:
 * chevrons mean movement WITHIN the experience, arrows mean an action or
 * LEAVING it.
 *
 *   chevron-right          internal navigation            <ChevronRight />
 *   chevron-down-in-circle in-page jump / anchor          <ChevronDownCircle />
 *   arrow-down-in-circle   download                       <ArrowDownCircle />
 *   arrow-up-right         external link, opens new tab   <ArrowUpRight />
 *
 * Two hard prohibitions, both from the contract:
 *   - NEVER SF Symbols assets or fonts. Apple's license restricts them to
 *     software running on Apple platforms; this is a website.
 *   - NEVER a Unicode arrow character (U+2192 / U+2197 / U+2193). iOS renders
 *     U+2197 as a colour emoji, every font draws them at a different length,
 *     and being real text they orphan-wrap onto a line of their own.
 * Hence: self-drawn `stroke` paths, `currentColor`, `aria-hidden`.
 *
 * This file is the single source of truth on purpose. `NewTabHint.tsx` next
 * door exists because the same affordance had been hand-rolled at every call
 * site and drifted; do not re-draw any of these four anywhere else.
 *
 * ---------------------------------------------------------------------------
 * Geometry (why the numbers are what they are)
 *
 * Every glyph renders in a box 0.65em tall -- `.link-glyph` in
 * `src/app/styles/shared.css` owns the size, colour and baseline shift so
 * there is one knob, not one per call site.
 *
 * The viewBoxes differ per glyph because the FORMS differ: a bare chevron is
 * naturally narrow (Apple's chevron.right is ~0.58 as wide as it is tall), a
 * circle-enclosed glyph is square. Each viewBox is sized to its own form so
 * the drawing fills it, rather than forcing every glyph into one square box
 * where the chevron would float in dead space.
 *
 * Strokes are plain user units (NOT `vector-effect: non-scaling-stroke`,
 * which would pin the stroke to a fixed CSS pixel width and stop it tracking
 * `font-size`). Scale factor is 0.65em / viewBox height, so:
 *   - bare glyphs  stroke 1.9 / 13 units  -> 0.095em  (~1.4px at 15px text)
 *   - circle glyphs stroke 1.5 / 14 units -> 0.070em  (~1.0px at 15px text)
 * The circle-enclosed pair is deliberately LIGHTER. A ring carries far more
 * ink than an open chevron, and at 0.65em a ring drawn at the bare-glyph
 * weight is 34% of its own radius -- it stops reading as a circle and reads
 * as a blob.
 *
 * All three arrow/chevron strokes are drawn at 45 degrees, which is what SF
 * Symbols' chevrons measure once the round cap is accounted for.
 */

/* ---------------------------------------------------------------------- *
 * The glyphs
 * ---------------------------------------------------------------------- */

/** Internal navigation: "Case study", "The story", "All projects". */
export function ChevronRight() {
  return (
    <svg
      className="link-glyph link-glyph-chevron"
      viewBox="0 0 8 13"
      aria-hidden="true"
      strokeWidth={1.9}
    >
      <path d="M1.55 1.6 6.45 6.5 1.55 11.4" />
    </svg>
  );
}

/** In-page jump to an anchor on the same page: "Launch live demo". */
export function ChevronDownCircle() {
  return (
    <svg
      className="link-glyph link-glyph-square"
      viewBox="0 0 14 14"
      aria-hidden="true"
      strokeWidth={1.5}
    >
      <circle cx="7" cy="7" r="6.1" />
      <path d="M4.6 5.9 7 8.3 9.4 5.9" />
    </svg>
  );
}

/** Download: "Résumé (PDF)". */
export function ArrowDownCircle() {
  return (
    <svg
      className="link-glyph link-glyph-square"
      viewBox="0 0 14 14"
      aria-hidden="true"
      strokeWidth={1.5}
    >
      <circle cx="7" cy="7" r="6.1" />
      <path d="M7 4.2v5.2" />
      <path d="M4.7 7.1 7 9.4 9.3 7.1" />
    </svg>
  );
}

/** External destination, opens in a new tab: GitHub / LinkedIn / App Store. */
export function ArrowUpRight() {
  return (
    <svg
      className="link-glyph link-glyph-square"
      viewBox="0 0 12 12"
      aria-hidden="true"
      strokeWidth={1.75}
    >
      <path d="M2 10 10 2" />
      <path d="M4.6 2H10v5.4" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- *
 * The no-orphan-wrap rule
 * ---------------------------------------------------------------------- */

/**
 * Renders `label` with `glyph` welded to its LAST WORD inside a
 * `white-space: nowrap` span, so the glyph can never wrap onto a line of its
 * own. "Case study" becomes `Case ` + `<span>study<glyph/></span>`.
 *
 * Splitting the last word in code rather than by hand at each call site is
 * what makes the rule unbreakable, and it is the only way to apply it to the
 * labels that are DATA (`HomeWork`'s compact tiles pass `project.title`).
 *
 * The outer wrapper is load-bearing, not decoration. Most call sites are
 * `.pill` / `.projects-mini`, which are `display: inline-flex`. A flex
 * container discards any anonymous item made only of white space and strips
 * the trailing space from every text run, so `Résumé <span>…</span>` as two
 * bare flex items would render with NO space between "Résumé" and "(PDF)".
 * Wrapping the whole label in one element makes it a single flex item, and
 * the space between the words is laid out as ordinary inline text again.
 */
export function AffordanceLabel({ label, glyph }: { label: string; glyph: ReactNode }) {
  const split = label.lastIndexOf(' ');
  const head = split === -1 ? '' : label.slice(0, split + 1);
  const tail = split === -1 ? label : label.slice(split + 1);

  return (
    <span>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        {glyph}
      </span>
    </span>
  );
}
