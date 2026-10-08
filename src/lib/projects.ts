import projectsData from '@/data/projects.json';
import nahtadiReviewsData from '@/data/nahtadiReviews.json';
import {
  NahtadiReviewsFileSchema,
  ProjectsFileSchema,
  type NahtadiReview,
  type Project,
} from './projectSchema';

export type { NahtadiReview, Project, Tier } from './projectSchema';

const projects: Project[] = ProjectsFileSchema.parse(projectsData).projects;

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getShowcaseProjects(): Project[] {
  return projects.filter((p) => p.tier === 'showcase');
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/**
 * The projects that own a `/projects/[slug]` case study, in catalog order.
 *
 * `showcase` alone is not the answer: a showcase project with its own
 * `detailPath` lives at a frozen URL instead, so it has no `[slug]` page. That
 * is the same predicate `generateStaticParams` uses, and the reason both read
 * it from here: the route's static params and its "next case study" link must
 * never disagree about which pages exist, or the nav would point at a slug the
 * route 404s.
 */
export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.tier === 'showcase' && !p.detailPath);
}

/**
 * The next case study after `id`, wrapping at the end of the list.
 *
 * The bottom nav has fixed slots: `← All projects` on the left, `Next case
 * study` on the right, always, with no "previous". A fixed slot has to be
 * filled, so the list wraps rather than running out. With today's two case
 * studies each one's next is the other; with one it would be itself, so the
 * caller drops the slot in that case rather than linking to the page you are
 * already on.
 */
export function getNextCaseStudy(id: string): Project | null {
  const caseStudies = getCaseStudyProjects();
  const index = caseStudies.findIndex((p) => p.id === id);
  if (index === -1 || caseStudies.length < 2) return null;
  return caseStudies[(index + 1) % caseStudies.length];
}

export function getProjectHref(p: Project): string | null {
  if (p.tier === 'card') return null;
  return p.detailPath ?? `/projects/${p.id}`;
}

/**
 * `cardStat` with its `{stars}` token filled in from `githubStars`.
 *
 * THROWS rather than rendering a blank or literal token: a card that names a
 * star count it does not have fails the build, and Cloudflare keeps the last
 * good deploy live. A stale count is acceptable; a missing one never ships.
 */
export function getCardStat(p: Project): string | undefined {
  if (p.cardStat === undefined) return undefined;
  if (!p.cardStat.includes('{stars}')) return p.cardStat;
  if (p.githubStars === undefined) {
    throw new Error(`projects.json: "${p.id}" uses {stars} in cardStat but has no githubStars.`);
  }
  return p.cardStat.replaceAll('{stars}', String(p.githubStars));
}

/** Parsed once at module load, like the catalog. A malformed reviews file is a
 *  build failure, not a runtime surprise. */
const nahtadiReviews = NahtadiReviewsFileSchema.parse(nahtadiReviewsData).reviews;

export function getNahtadiReviews(): NahtadiReview[] {
  return nahtadiReviews;
}
