'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/lib/projects';
import { ALL_CATEGORIES, type CategoryChip } from '@/lib/projectCategories';
import NewTabHint from '@/components/NewTabHint';
import { AffordanceLabel, ArrowUpRight } from '@/components/LinkAffordance';
import { GitHubMark } from '@/components/BrandMarks';
import ProjectFilter from './ProjectFilter';
import ProjectCard from './ProjectCard';

interface FilterableProjectListProps {
  projects: Project[];
  chips: CategoryChip[];
}

/**
 * Search and category state for the Projects grid.
 *
 * The match set is `title` + `tagline` + `description` + `technologies` +
 * `keywords`:
 *
 *  - `tagline` is in it because it is the text the card actually renders.
 *    Typing a word that is visibly on screen and getting an empty grid is the
 *    worst failure this search can have.
 *  - `description` stays in it even though the card no longer renders it. It
 *    carries the specific vocabulary people search for ("Qibla", "Pix2Pix",
 *    "closest point of approach") and dropping it would quietly return fewer
 *    results than the page returned before this rebuild.
 *  - `technologies` is the contract's "tech keywords"; `keywords` is the
 *    schema's own optional search-terms field, currently unused by every
 *    project but honoured so filling it in later just works.
 *
 * There is no debounce and no animation. Filtering is a per-keystroke
 * interaction, so it reflows instantly; a transition here would read as the
 * page lagging behind the typing.
 */
export default function FilterableProjectList({ projects, chips }: FilterableProjectListProps) {
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [query, setQuery] = useState('');

  const haystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) {
      map.set(
        p.id,
        [p.title, p.tagline ?? '', p.description, ...p.technologies, ...(p.keywords ?? [])]
          .join(' ')
          .toLowerCase()
      );
    }
    return map;
  }, [projects]);

  const term = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (category !== ALL_CATEGORIES && p.category !== category) return false;
        if (!term) return true;
        return (haystacks.get(p.id) ?? '').includes(term);
      }),
    [projects, haystacks, category, term]
  );

  const clearFilters = () => {
    setCategory(ALL_CATEGORIES);
    setQuery('');
  };

  return (
    <>
      <ProjectFilter
        chips={chips}
        category={category}
        query={query}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
      />

      {/* Beat 4 of the entrance cascade, the same delay the filter bar carries.
          THE ANIMATION LIVES HERE, ON A CONTAINER WHOSE IDENTITY NEVER
          CHANGES, and never on the cards: this element is not keyed and is not
          conditionally swapped, so filter state changes re-render it without
          remounting it and the cascade cannot replay per keystroke. Cards ARE
          keyed by project id and do remount as the filtered set changes, which
          is exactly why they carry no entrance of their own -- see the block
          comment on `.projects-enter` in projects.css. */}
      <div className="page-wrap projects-enter projects-enter-body">
        {/* One atomic status message, not a bare number, so a screen reader
            hears "4 of 13 projects" rather than "4". */}
        <p role="status" aria-atomic="true" className="text-muted pt-[18px] text-[13px] font-semibold">
          {filtered.length} of {projects.length} projects
        </p>

        <div className="grid grid-cols-2 gap-4 pt-[22px] max-[880px]:grid-cols-1">
          {filtered.length === 0 ? (
            <div className="text-muted col-span-2 py-14 text-center max-[880px]:col-span-1">
              <strong className="text-primary mb-1.5 block text-[17px] font-bold">
                {term ? `Nothing matches “${query.trim()}”` : 'Nothing matches this filter'}
              </strong>
              <p className="text-[14px]">
                Try a broader term, or{' '}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-accent cursor-pointer font-semibold underline underline-offset-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)]"
                >
                  clear the filter
                </button>
                .
              </p>
            </div>
          ) : (
            filtered.map((project) => <ProjectCard key={project.id} project={project} />)
          )}
        </div>

        {/* The grid's closing footnote. /projects is the catalog, not the whole
            of the work, so it ends with one quiet pointer at the rest.

            TERTIARY BY CONSTRUCTION: `.link-quiet` (shared.css) is a bare text
            link with no ground and no radius, so it cannot compete with the
            `Case study` pills inside the cards above it. It is the same
            construction the case-study bottom nav wears -- shared code, not a
            second quiet-link style.

            CENTRED UNDER THE GRID, which is the third position this line has
            had and the one that finally reads right.

            Left-aligned it sat under the bottom-left card, and because the
            last grid row is often half empty it read as something left over
            from that card rather than as the end of the list. Centring makes
            it an end-of-list marker: it belongs to the whole grid, not to
            whichever card happens to be above it. It is also what `HomeWork`
            already does with the `All projects` link that closes ITS grid, so
            this is the site's existing answer to the same question rather than
            a new one.

            A hairline above it was tried and rejected: the footer's own rule
            sits ~120px below, and two full-width hairlines that close together
            read as a boxed-in strip rather than as a closing edge.

            OUTSIDE the grid but INSIDE `.projects-enter-body`, so it rides
            beat 4 of the entrance cascade rather than adding a beat of its
            own -- tests/e2e/projects-entrance.spec.ts asserts the cascade is
            exactly five `.projects-enter` elements, and a sixth would break
            it. It also sits outside the `filtered` branch on purpose: it is
            page furniture, so it survives a filter that empties the grid,
            which is the moment a reader most needs somewhere else to go.

            THE BAND IS SYMMETRIC, and it is expressed as ONE number for
            exactly that reason. This used to be a 34px margin on the link plus
            an 80px padding below it -- two values in two places whose only
            relationship was accidental, and they were not equal: the link sat
            2.4x closer to the grid than to the footer's hairline and read as
            having drifted upward. `py-[57px]` on the wrapper states the
            spacing once, so the two halves cannot fall out of step again.

            57px is what centres the link in the band the eye actually sees --
            bounded by the last card's edge above and the footer's rule below
            -- while keeping the page's total height exactly what it was.

            `text-center` rather than a flex row, because `.projects-more` is
            an inline-block by design -- the mark sits inside the phrase, so
            the link lays out as text and `text-align` is the matching tool.
            The baseline strut costs about a pixel at the top and nothing that
            matters at the bottom; measured at rest, 58px above and 57.5px
            below.

            It does NOT weaken the link's tie to the grid, which is the usual
            objection to centring a closing element. The hairline is a divider,
            not content: the footer's own copy sits another 56px past it, so
            the link is 57px from the grid and ~113px from the nearest footer
            text. Still twice as close to what it belongs to.

            THE OCTOCAT IS WHAT MAKES IT FINDABLE. At 13px with no mark this
            was reported as almost missed on a real read of the page. A logo
            anchors the eye far harder than type weight does and spends none of
            the emphasis a filled ground would, so the link gets easier to see
            while staying a footnote. `.projects-more` carries the size and the
            mark's inline metrics; see projects.css for why the colour
            deliberately stays muted.

            THE MARK IS INSIDE THE PHRASE, not ahead of it. It led the whole
            line at first, which put the octocat against "More" -- a word that
            does not have a logo. Passed as `AffordanceLabel`'s `mark`, it goes
            into the same nowrap span as the tail word and the arrow, so
            "[octocat]GitHub[arrow]" is one atomic unit and a narrow line can
            only ever break at the space before it.

            The arrow is the drawn `ArrowUpRight`, never a `→` character:
            grammar v2 bans Unicode arrows and
            tests/e2e/link-affordance.spec.ts fails on one. It stays even
            though the octocat now names the destination -- the two say
            different things, and the arrow is the one carrying "opens in a new
            tab" for sighted readers. */}
        <div className="py-[57px] text-center">
          <a
            href="https://github.com/osyounis"
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet projects-more"
          >
            <AffordanceLabel
              label="More on GitHub"
              mark={<GitHubMark />}
              glyph={<ArrowUpRight />}
            />
            <NewTabHint />
          </a>
        </div>
      </div>
    </>
  );
}
