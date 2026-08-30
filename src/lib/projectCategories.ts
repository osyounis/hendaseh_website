import type { Project } from './projectSchema';

/**
 * Chip labels for the Projects filter bar.
 *
 * The label is NOT derivable from the category value. `projects.json` stores
 * `mobile`, but the approved contract's chip reads **iOS**
 * (docs/superpowers/mockups/projects/APPROVED.md, "Chips"). Title-casing the
 * raw category would silently ship a chip labelled "Mobile" that no contract
 * asks for, so the mapping is explicit and this file owns it.
 *
 * Key order is chip order. `All` is prepended by `getCategoryChips`.
 */
const CATEGORY_LABELS: Record<string, string> = {
  mobile: 'iOS',
  'machine-learning': 'Machine Learning',
  'scientific-computing': 'Scientific Computing',
  'data-tools': 'Data Tools',
  'engineering-tools': 'Engineering Tools',
};

export const ALL_CATEGORIES = 'all';

export interface CategoryChip {
  /** `all`, or a raw `project.category` value. */
  value: string;
  label: string;
}

/**
 * Builds the chip row from the catalog, in `CATEGORY_LABELS` order.
 *
 * Only categories that actually have a project are offered, so no chip can
 * filter to an empty grid. A category present in the data with no label entry
 * throws: /projects is statically prerendered, so this fails the build rather
 * than shipping an unlabelled or naively title-cased chip.
 */
export function getCategoryChips(projects: Project[]): CategoryChip[] {
  const present = new Set(projects.map((p) => p.category));

  const unlabelled = [...present].filter((c) => !(c in CATEGORY_LABELS));
  if (unlabelled.length > 0) {
    throw new Error(
      `projectCategories: no chip label for category "${unlabelled.join('", "')}". ` +
        'Add it to CATEGORY_LABELS in src/lib/projectCategories.ts.'
    );
  }

  return [
    { value: ALL_CATEGORIES, label: 'All' },
    ...Object.entries(CATEGORY_LABELS)
      .filter(([value]) => present.has(value))
      .map(([value, label]) => ({ value, label })),
  ];
}
