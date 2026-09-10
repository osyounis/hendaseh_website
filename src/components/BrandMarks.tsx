/**
 * Destination marks -- the logos that say WHERE a link goes.
 *
 * The sibling of `LinkAffordance.tsx`, and deliberately a separate file. That
 * one owns the five AFFORDANCE glyphs, which say what a link DOES (leaves the
 * site, navigates in, downloads); these say what is on the other end. The two
 * families answer different questions, are drawn differently (these are filled
 * paths, those are stroked outlines), and are sized by different rules -- so
 * they do not belong in one module.
 *
 * That difference is also why every rule that sizes a destination mark is
 * scoped `svg:not(.link-glyph)`. A bare `svg { fill: currentColor }` inside a
 * pill would render the stroked affordance glyph next to it as a solid blob.
 * The scoping already exists in `.projects-mini`, `.case-btn-*` and here.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 *
 * The octocat path was inlined at three call sites (`ProjectCard.tsx`, the
 * case-study template, `contact/page.tsx`), each with a comment explaining
 * that it is inline "rather than pulled from react-icons so each glyph is the
 * exact path the approved mockup draws, and so the icon set does not change
 * under the page when a dependency updates."
 *
 * That reasoning is about NOT TAKING A DEPENDENCY, and it still holds -- these
 * are hand-held local paths, not `react-icons`. It was never an argument for
 * copying the same 400-character string into every file that needs it, which
 * is what it had turned into. A local module keeps the guarantee (the paths
 * are right here, pinned, and nothing upstream can change them) and stops the
 * copies multiplying.
 *
 * ---------------------------------------------------------------------------
 * SIZE IS PER MARK, AND IT IS MATCHED ON INK
 *
 * The same law `LinkAffordance.tsx` states for the affordance glyphs, and the
 * reason it exists is on /contact right now: both channel marks share one 26px
 * box there, and the two forms fill their viewBoxes by very different amounts.
 *
 *   octocat    viewBox 16x16   ink/box 0.975   (very nearly full-bleed)
 *   LinkedIn   viewBox 24x24   ink/box 0.714   (the glyph is inset)
 *
 * At one shared box the octocat renders 37% larger. A column apart on Contact
 * that passes unnoticed; side by side in a single pill row it reads as a
 * mistake. So the BOXES DIFFER PRECISELY SO THE INK DOES NOT:
 *
 *   .brand-mark-github     1.1em  ->  ink 1.1  x 0.975 = 1.0725em
 *   .brand-mark-linkedin   1.5em  ->  ink 1.5  x 0.714 = 1.0710em
 *
 * Do not "tidy" those two numbers into one shared value. That is the defect,
 * not the inconsistency.
 *
 * ---------------------------------------------------------------------------
 * WHY 1.5em IS A CEILING, NOT A PREFERENCE
 *
 * A `.pill` is `display: inline-flex; align-items: center` with a 22.5px line
 * box (15px text at line-height 1.5) and 14px of padding. Its height is the
 * TALLEST item plus the padding, so a mark taller than the line box grows that
 * pill -- and a row of pills where only the LinkedIn one is 2px taller than
 * its neighbours is exactly the kind of thing that reads as broken without
 * anyone being able to say why.
 *
 * The LinkedIn glyph needs the larger of the two boxes, so it is the one that
 * hits the ceiling first: 1.5em IS the line box. Everything else is derived
 * from it -- the ink target is whatever 1.5em of that inset viewBox yields,
 * and the octocat's box is then whatever matches that ink. Expressed in `em`
 * rather than px so the relationship survives a change of font-size instead of
 * quietly breaking at the next one.
 *
 * `tests/e2e/homepage.spec.ts` asserts all three: matched ink, unmatched
 * boxes, and unchanged pill heights.
 */

/** Octocat, 16x16 viewBox. Ink fills 0.975 of the box. */
const GITHUB_PATH =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z';

/** LinkedIn wordmark glyph, 24x24 viewBox. Ink fills 0.714 of the box. */
const LINKEDIN_PATH =
  'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z';

/**
 * `className` REPLACES the default classes rather than adding to them, and
 * that is the whole point of the prop.
 *
 * Two call sites size these marks themselves and predate this module:
 * `/contact`'s channel cards (`.contact-card-mark` -- 26px, and filled with
 * `var(--contact-mark)` rather than `currentColor`) and the case-study hero
 * button (sized by `.case-btn-white svg:not(.link-glyph)`). Appending the
 * default classes there would put `.brand-mark-github`'s 1.1em and
 * `.brand-mark`'s `fill: currentColor` in a same-specificity fight with those
 * rules, decided by stylesheet import order -- which is exactly the kind of
 * silent, order-dependent breakage that makes a refactor "ruin" a page.
 *
 * Replacing instead means those call sites render byte-identical markup to
 * what they had before: same element, same viewBox, same single class. The
 * only thing that changed for them is where the path string lives.
 */
export function GitHubMark({ className = 'brand-mark brand-mark-github' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d={GITHUB_PATH} />
    </svg>
  );
}

export function LinkedInMark({
  className = 'brand-mark brand-mark-linkedin',
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={LINKEDIN_PATH} />
    </svg>
  );
}
