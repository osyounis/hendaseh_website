/**
 * Visually-hidden text appended after the `aria-hidden` arrow-up-right glyph
 * (`ArrowUpRight` in `LinkAffordance.tsx`) on every external link, so
 * screen-reader users get the "opens in a new tab" affordance the arrow
 * otherwise only conveys visually.
 *
 * The leading space in the string is load-bearing: it is concatenated
 * directly onto whatever precedes it in the accessible name (e.g. "GitHub"
 * + this), and without it screen readers announce run-together words like
 * "MITopens in a new tab". Single source of truth — every external-link call
 * site imports this instead of hand-rolling the `sr-only` span.
 */
export default function NewTabHint() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}
