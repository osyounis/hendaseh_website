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
