/**
 * Pause and play — the site's two TRANSPORT glyphs.
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
