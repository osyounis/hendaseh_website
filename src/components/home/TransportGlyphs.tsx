/**
 * Pause, play and replay — the site's TRANSPORT glyphs.
 *
 * They live here, beside `HomeTicker.tsx`, and emphatically NOT in
 * `LinkAffordance.tsx`. That file holds the five LINK-affordance glyphs, whose
 * stroke weight, viewBox clearance and side bearings are a locked,
 * test-guarded family measured off apple.com; a media control is not one of
 * them and adding it would corrupt a closed vocabulary. Same ruling the
 * /nahtadi contract applies to the FAQ's rotating plus.
 *
 * These are FILLED rather than stroked, matching how Apple draws transport
 * controls, and sized so the filled mass reads at the same optical weight as
 * the stroked family beside it.
 *
 * WHY THIS FILE EXISTS: the drawings were written inline in `HomeTicker.tsx`
 * when the ticker was their only consumer. Task N3 gave them a second one —
 * /nahtadi's reviews carousel, whose pause control closes the same WCAG 2.2.2
 * (Pause, Stop, Hide, Level A) gap on an auto-advancing region. One drawing,
 * two consumers: a second hand-drawn pair would have been two glyphs that look
 * the same until one of them is edited.
 *
 * The two consumers differ in MECHANISM, not in mark. The ticker pauses a CSS
 * animation and so can use a real checkbox and stay server-rendered; the
 * carousel's auto-advance is a `setInterval`, which no checkbox can stop, so
 * it uses a real `<button aria-pressed>`. Both flip icon and accessible name
 * together via `display: none`, which removes a node from the accessible name
 * computation as well as from the page — so the name can never say "Pause"
 * while the icon shows a play triangle.
 *
 * `className` is the only prop: each call site owns its own sizing and its own
 * show/hide selector, and neither owns the geometry. Both are `aria-hidden` —
 * the call site's own clipped label text is the accessible name.
 */

/** The two upright bars. */
export function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" aria-hidden="true">
      <rect x="3.4" y="2" width="2.6" height="10" rx="0.7" fill="currentColor" />
      <rect x="8" y="2" width="2.6" height="10" rx="0.7" fill="currentColor" />
    </svg>
  );
}

/**
 * The triangle. It carries a matching stroke as well as a fill so its three
 * corners read as rounded at 13-14px, where a bare fill on a `Z`-closed path
 * renders visibly sharp against the softer pause bars.
 */
export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M4.2 2.4 11.4 7l-7.2 4.6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The counterclockwise arrow — a clip that has PLAYED OUT, not one that is
 * merely paused. It exists because the case-study clips stopped looping: their
 * first and last frames are entirely different pictures, so a loop could only
 * cut hard between them. A play-once clip needs a third state, and "Play" on a
 * clip already showing its final frame says the wrong thing.
 *
 * STROKED, where its two neighbours are filled, and that is not an
 * inconsistency. The filled rule above is about how Apple draws PAUSE and PLAY;
 * Apple draws its own replay marks (`arrow.counterclockwise`, `gobackward`) as
 * strokes, because a ring with a gap has no filled form. Stroke weight 1.5 on
 * the 14x14 box lands at the same optical mass as the pause bars.
 *
 * The geometry is computed rather than eyeballed: centre (7,7), radius 4.35, an
 * arc from 110 degrees clockwise the long way round to 155, leaving a 45-degree
 * gap, with the head placed on the arc's start and pointed along the
 * counterclockwise tangent there. Rendered and checked at 15px, the size it
 * actually ships at.
 */
export function ReplayGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M5.51 2.91A4.35 4.35 0 1 1 3.06 5.16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.43 3.31 7.04 3.74 6.15 1.3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
