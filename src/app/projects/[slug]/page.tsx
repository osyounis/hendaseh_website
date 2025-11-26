import { getProjectById, getAllProjects } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects
    .filter(p => p.hasDetailPage)
    .map(p => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectById(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found | Omar Younis',
    };
  }

  return {
    title: `${project.title} | Omar Younis`,
    description: project.description,
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = getProjectById(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Back button */}
      <Link
        href="/projects"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block font-medium transition-colors"
      >
        ← Back to Projects
      </Link>

      {/* Project header */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {project.title}
      </h1>
      <p className="text-xl text-gray-700 mb-8 leading-relaxed">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Stats */}
      {project.stats && (
        <p className="text-sm text-gray-500 mb-8">{project.stats}</p>
      )}

      {/* Embedded Streamlit App (if embedUrl exists) */}
      {project.embedUrl && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interactive Demo
          </h2>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <iframe
              src={project.embedUrl}
              className="w-full h-[800px]"
              title={`${project.title} - Interactive Demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Note:</strong> The app may take 30 seconds to wake from sleep on first load
            (Streamlit Cloud free tier).
          </p>
        </div>
      )}

      {/* Links */}
      <div className="flex gap-4 mb-12">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View on GitHub →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Open in New Tab →
          </a>
        )}
      </div>

      {/* Project Details Section */}
      <div className="prose prose-lg max-w-none">
        <h2>About This Project</h2>
        <p>{project.description}</p>

        {project.githubUrl && (
          <div className="mt-6">
            <h3>Source Code</h3>
            <p>
              The complete source code for this project is available on{' '}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
