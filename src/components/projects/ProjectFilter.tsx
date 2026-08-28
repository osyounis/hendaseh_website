'use client';

import type { CategoryChip } from '@/lib/projectCategories';

/**
 * The sticky filter bar: live search plus single-select category chips.
 *
 * Fully controlled. The previous version kept its own copy of the query and
 * the selected category alongside the list's copy, so two components held the
 * same truth and could disagree; the list owns it now and this renders it.
 *
 * Nothing here is animated except pointer-down press feedback. Filtering runs
 * on every keystroke, which is the frequency band where decoration reads as
 * lag, so the grid reflows instantly and the chips never transition their
 * layout.
 */

interface ProjectFilterProps {
  chips: CategoryChip[];
  category: string;
  query: string;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
}

export default function ProjectFilter({
  chips,
  category,
  query,
  onCategoryChange,
  onQueryChange,
}: ProjectFilterProps) {
  return (
    // `projects-enter-body` is beat 4 of the page's entrance cascade, shared
    // with the grid in `FilterableProjectList` so the two arrive in unison.
    // The animation is on the sticky element ITSELF, never on an ancestor --
    // an animated ancestor's containing block is what breaks sticky.
    <div className="projects-bar projects-enter projects-enter-body">
      <div className="page-wrap">
        <div className="flex flex-wrap items-center gap-3.5 py-3.5">
          <div className="relative min-w-[260px] flex-1">
            <label htmlFor="projects-search" className="sr-only">
              Search projects
            </label>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              aria-hidden="true"
              className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
            <input
              id="projects-search"
              type="search"
              className="projects-search-input"
              placeholder="Search by name, tech, or keyword"
              autoComplete="off"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>

          <div
            role="group"
            aria-label="Filter projects by category"
            className="projects-chiprow min-w-0"
          >
            {chips.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className="projects-chip"
                aria-pressed={value === category}
                onClick={() => onCategoryChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
