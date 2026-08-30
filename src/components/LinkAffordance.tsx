import type { ReactNode } from 'react';

/**
 * Link-affordance grammar v2 -- the ONE definition of the five affordance
 * glyphs and of the rule that glues them to a label.
 *
 * Contract: `docs/superpowers/mockups/contact/APPROVED.md`, section
 * "Link-affordance grammar v2 (SITEWIDE LAW)". Apple's own symbol semantics:
 * chevrons mean movement WITHIN the experience, arrows mean an action or
 * LEAVING it.
 *
 *   chevron-right          internal navigation            <ChevronRight />
 *   chevron-left           back / return (LEADING)        <ChevronLeft />
 *   chevron-down-in-circle in-page jump / anchor          <ChevronDownCircle />
 *   arrow-down-in-circle   download                       <ArrowDownCircle />
 *   arrow-up-right         external link, opens new tab   <ArrowUpRight />
 *
 * Two hard prohibitions, both from the contract:
 *   - NEVER SF Symbols assets or fonts. Apple's license restricts them to
 *     software running on Apple platforms; this is a website.
 *   - NEVER a Unicode arrow character (U+2192 / U+2197 / U+2193 / U+2190).
 *     iOS renders U+2197 as a colour emoji, every font draws them at a
 *     different length, and being real text they orphan-wrap onto a line of
 *     their own.
 * Hence: self-drawn `stroke` paths, `currentColor`, `aria-hidden`.
 *
 * This file is the single source of truth on purpose. `NewTabHint.tsx` next
 * door exists because the same affordance had been hand-rolled at every call
 * site and drifted; do not re-draw any of these five anywhere else.
 *
 * ---------------------------------------------------------------------------
 * Geometry (why the numbers are what they are)
 *
 * Sizes are PER GLYPH, not one shared value -- `.link-glyph-chevron`,
 * `.link-glyph-arrow` and `.link-glyph-circle` in `src/app/styles/shared.css`
 * own height, width, side bearing and baseline shift.
 *
 * The targets are MEASURED, not eyeballed: each glyph's INK height was read
 * off apple.com's own rendering as a ratio of the capital-letter height in
 * the same screenshot, then converted through Roboto's cap height (0.711em).
 * Two independent references agreed to the pixel on the chevron and on the
 * circle pair.
 *
 *   chevron-left / chevron-right   ink 0.533em   75% of cap
 *   arrow-up-right                 ink 0.599em   83% of cap
 *   the two circle-enclosed marks  ink 1.009em  142% of cap
 *
 * INK, not box. "Ink" is the visible drawn extent -- the drawn coordinates
 * grown by half a stroke-width on every side, because round caps and joins
 * are discs of radius sw/2. The box is always larger: see the clipping
 * invariant below. Box heights fall out of the ink targets, they are not
 * chosen: 0.714em, 0.78em, 1.19em.
 *
 * The circle pair MUST be the largest. A ring at the same box height as a
 * bare chevron spends its whole size budget on the ring and the interior
 * arrow collapses to a few pixels.
 *
 * The viewBoxes differ per glyph because the FORMS differ: a bare chevron is
 * naturally narrow, the diagonal arrow and the enclosed marks are square.
 *
 * ---------------------------------------------------------------------------
 * ONE STROKE WEIGHT ACROSS THE FAMILY
 *
 * Every glyph is drawn at ~0.090em of stroke regardless of its size. That is
 * how a symbol family works -- SF Symbols keeps one stroke weight per weight
 * class and varies only the form's height, which is exactly the pattern the
 * measurements show (three different ink heights, one visual weight). It is
 * also the reason the strokes are NOT simply scaled up with the boxes: doing
 * that would have made the chevron -- the SMALLEST mark -- the heaviest thing
 * on the line (0.109em against the arrow's 0.090em), which reads as bolder
 * rather than bigger.
 *
 * Strokes are plain user units (NOT `vector-effect: non-scaling-stroke`,
 * which would pin the stroke to a fixed CSS pixel width and stop it tracking
 * `font-size`). Scale factor is the box height / viewBox height, so:
 *   - chevrons       2 / 15.8   at 0.714em -> 0.0904em  (~1.36px at 15px text)
 *   - arrow-up-right 2 / 17.3   at 0.78em  -> 0.0902em  (~1.35px at 15px text)
 *   - circle glyphs  1.6 / 21   at 1.19em  -> 0.0907em  (~1.36px at 15px text)
 * Held against Roboto's own stems (~0.13em at the pill's weight) the glyphs
 * stay lighter than the label they follow, which is the point.
 *
 * ---------------------------------------------------------------------------
 * Clipping (the reason for the padding inside every viewBox)
 *
 * SVG's default `overflow: hidden` clips at the viewBox edge, and a stroked
 * path's ink reaches HALF A STROKE-WIDTH beyond its own coordinates. The
 * previous circle glyphs put their ink 0.15 user units from the edge -- 0.1
 * device px -- and antialiasing made the clip visible.
 *
 * INVARIANT, enforced by arithmetic, not by eye: every glyph's ink extreme
 * (coordinate +/- sw/2) clears the viewBox edge by at least ONE FULL
 * stroke-width. Equivalently, every drawn coordinate sits at least 1.5*sw
 * inside the box. All five glyphs below sit at exactly 1.00*sw of ink
 * clearance on the sides their drawing touches -- the minimum -- so none of
 * the box is wasted beyond what the invariant costs.
 *
 * The invariant is why ink is a fixed fraction of the box and why MORE INK
 * MEANS A BIGGER BOX. Ink is never bought back by shrinking the clearance:
 *   chevron  ink/box = 11.8 / 15.8 = 0.7468  -> 0.533em of ink needs 0.714em
 *   circle   ink/box = 17.8 / 21   = 0.8476  -> 1.009em of ink needs 1.19em
 *   arrow    ink/box = 13.3 / 17.3 = 0.7688  -> 0.599em of ink needs 0.78em
 *
 * That padding is also why the side bearings are what they are: the ink
 * starts one stroke-width in from the box edge, so `margin-left` is the
 * TARGET GAP MINUS that stroke-width. The gap the eye sees is ~0.35em for the
 * chevrons and the diagonal arrow, ~0.38em for the heavier circles -- both
 * measured off apple.com alongside the ink heights.
 *
 * All arrow/chevron strokes are drawn at 45 degrees, which is what SF
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
      viewBox="0 0 10.9 15.8"
      aria-hidden="true"
      strokeWidth={2}
    >
      <path d="M3 3 7.9 7.9 3 12.8" />
    </svg>
  );
}

/**
 * Back / return: "All projects", "Back to Nahtadi App Page".
 *
 * The mirror of `ChevronRight`, and the only LEADING glyph -- it precedes its
 * label, so it welds to the label's FIRST word via `LeadingAffordanceLabel`
 * and takes its side bearing on the right. Apple's own back affordance is a
 * chevron-left, which is why this is a chevron and not an arrow.
 */
export function ChevronLeft() {
  return (
    <svg
      className="link-glyph link-glyph-chevron link-glyph-leading"
      viewBox="0 0 10.9 15.8"
      aria-hidden="true"
      strokeWidth={2}
    >
      <path d="M7.9 3 3 7.9 7.9 12.8" />
    </svg>
  );
}

/** In-page jump to an anchor on the same page: "Launch live demo". */
export function ChevronDownCircle() {
  return (
    <svg
      className="link-glyph link-glyph-circle"
      viewBox="0 0 21 21"
      aria-hidden="true"
      strokeWidth={1.6}
    >
      <circle cx="10.5" cy="10.5" r="8.1" />
      <path d="M6.9 8.7 10.5 12.3 14.1 8.7" />
    </svg>
  );
}

/** Download: "Résumé (PDF)". */
export function ArrowDownCircle() {
  return (
    <svg
      className="link-glyph link-glyph-circle"
      viewBox="0 0 21 21"
      aria-hidden="true"
      strokeWidth={1.6}
    >
      <circle cx="10.5" cy="10.5" r="8.1" />
      <path d="M10.5 6.5V14.5" />
      <path d="M7.3 11.3 10.5 14.5 13.7 11.3" />
    </svg>
  );
}

/** External destination, opens in a new tab: GitHub / LinkedIn / App Store. */
export function ArrowUpRight() {
  return (
    <svg
      className="link-glyph link-glyph-arrow"
      viewBox="0 0 17.3 17.3"
      aria-hidden="true"
      strokeWidth={2}
    >
      <path d="M3 14.3 14.3 3" />
      <path d="M6.67 3H14.3V10.63" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- *
 * The no-orphan-wrap rule
 * ---------------------------------------------------------------------- */

/**
 * Renders `label` with a TRAILING `glyph` welded to its LAST WORD inside a
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

/**
 * The LEADING mirror of `AffordanceLabel`, for `ChevronLeft`.
 *
 * A leading glyph precedes the label, so the word it must never be separated
 * from is the FIRST one, not the last: `← All projects` becomes
 * `<span><glyph/>All</span> projects`. Welding it to the last word instead
 * would let the chevron orphan onto a line above its own label -- the exact
 * failure the nowrap rule exists to prevent, just at the other end.
 *
 * The outer wrapper is load-bearing for the same flex reason documented on
 * `AffordanceLabel`: it keeps the whole label one flex item so the space
 * between the first and second word survives.
 */
export function LeadingAffordanceLabel({ label, glyph }: { label: string; glyph: ReactNode }) {
  const split = label.indexOf(' ');
  const head = split === -1 ? label : label.slice(0, split);
  const tail = split === -1 ? '' : label.slice(split);

  return (
    <span>
      <span className="whitespace-nowrap">
        {glyph}
        {head}
      </span>
      {tail}
    </span>
  );
}
