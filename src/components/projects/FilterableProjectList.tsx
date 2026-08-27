'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/lib/projects';
import { ALL_CATEGORIES, type CategoryChip } from '@/lib/projectCategories';
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

      <div className="page-wrap">
        {/* One atomic status message, not a bare number, so a screen reader
            hears "4 of 13 projects" rather than "4". */}
        <p role="status" aria-atomic="true" className="text-muted pt-[18px] text-[13px] font-semibold">
          {filtered.length} of {projects.length} projects
        </p>

        <div className="grid grid-cols-2 gap-4 pt-[22px] pb-20 max-[880px]:grid-cols-1">
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
      </div>
    </>
  );
}
