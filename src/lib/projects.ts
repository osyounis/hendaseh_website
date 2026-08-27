import projectsData from '@/data/projects.json';
import nahtadiReviewsData from '@/data/nahtadiReviews.json';
import { ProjectsFileSchema, type Project } from './projectSchema';

export type { Project, Tier } from './projectSchema';

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

export interface NahtadiReview {
  title: string;
  author: string;
  date: string;
  text: string;
}

export function getNahtadiReviews(): NahtadiReview[] {
  return nahtadiReviewsData.reviews;
}
