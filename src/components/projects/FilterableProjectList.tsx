'use client';

import { useState, useMemo } from 'react';
import type { Project } from '@/lib/projects';
import ProjectFilter from './ProjectFilter';
import AnimatedProjectCard from './AnimatedProjectCard';

interface FilterableProjectListProps {
  projects: Project[];
}

export default function FilterableProjectList({ projects }: FilterableProjectListProps) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return Array.from(cats).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Category filter
      if (categoryFilter && project.category !== categoryFilter) {
        return false;
      }

      // Search filter (by technologies, title, or description)
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesTech = project.technologies.some(tech =>
          tech.toLowerCase().includes(search)
        );
        const matchesTitle = project.title.toLowerCase().includes(search);
        const matchesDesc = project.description.toLowerCase().includes(search);

        return matchesTech || matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [projects, categoryFilter, searchTerm]);

  const hasFilters = categoryFilter !== null || searchTerm !== '';

  return (
    <>
      {/* Filter Component */}
      <ProjectFilter
        categories={categories}
        onFilterChange={setCategoryFilter}
        onSearchChange={setSearchTerm}
      />

      {/* Results Count */}
      {hasFilters && (
        <p className="text-gray-600 mb-6">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      )}

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No projects found matching your criteria.</p>
          <button
            onClick={() => {
              setCategoryFilter(null);
              setSearchTerm('');
            }}
            className="text-[#0093FF] hover:text-[#0075CC] font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Project Grid */}
      <div className="grid gap-8">
        {filteredProjects.map((project, index) => (
          <AnimatedProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
