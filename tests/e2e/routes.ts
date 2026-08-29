/**
 * The site's public surface, in one place, for the specs that have to sweep
 * all of it (theme.spec.ts, a11y.spec.ts).
 *
 * Not a spec file — Playwright's default `testMatch` only collects
 * `*.spec.ts` / `*.test.ts`, so this is imported, never run.
 *
 * KEY_ROUTES is the six the plan names for the axe + Lighthouse gate: one per
 * page template. `/projects/brent-cuda` stands in for the case-study template
 * (`/projects/[slug]`), which is a template, not a page — the other showcase
 * study renders the same furniture with different content.
 *
 * ALL_ROUTES adds the surfaces that share a template with one of the six but
 * are worth sweeping anyway: the two frozen `/nahtadi` sub-pages the App Store
 * links to, and the second case study. The theme flip is sitewide, so it is
 * checked against all of them rather than a representative subset.
 */

export const KEY_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/projects/brent-cuda',
  '/contact',
  '/nahtadi',
] as const

export const ALL_ROUTES = [
  ...KEY_ROUTES,
  '/projects/collision-avoidance-radar',
  '/nahtadi/privacy',
  '/nahtadi/support',
] as const

export const THEMES = ['light', 'dark'] as const

export type Theme = (typeof THEMES)[number]
