import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects | Omar Younis',
  description: 'Software engineering projects - data engineering tools, machine learning applications, scientific computing, and engineering software',
};

export default function Projects() {
  const projects = getAllProjects();
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Projects</h1>
        <p className="text-xl text-gray-700">
          A collection of software engineering projects showcasing expertise in data engineering,
          machine learning, scientific computing, and engineering applications.
        </p>
      </div>

      <div className="grid gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
              {project.featured && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>

            {project.stats && (
              <p className="text-sm text-gray-500 mb-4">{project.stats}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.hasDetailPage && (
                <Link
                  href={`/projects/${project.id}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Interactive Demo →
                </Link>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Live Demo →
                </a>
              )}
              {!project.githubUrl && !project.liveUrl && !project.hasDetailPage && (
                <span className="px-6 py-2 text-gray-500 italic">
                  Internal/Private Project
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-700 mb-4">Want to see more?</p>
        <a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Visit My GitHub Profile →
        </a>
      </div>
    </div>
  );
}
