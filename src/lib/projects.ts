import projectsData from '@/data/projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  embedUrl: string | null;
  featured: boolean;
  stats: string;
  category: string;
  hasDetailPage?: boolean;
  buttonText?: string;
  image?: string;
  imageAlt?: string;
}

export function getAllProjects(): Project[] {
  return projectsData.projects;
}

export function getFeaturedProjects(): Project[] {
  return projectsData.projects.filter(p => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return projectsData.projects.find(p => p.id === id);
}
