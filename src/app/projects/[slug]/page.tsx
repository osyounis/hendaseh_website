import { getProjectById, getAllProjects } from '@/lib/projects';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects
    .filter(p => p.hasDetailPage)
    .map(p => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug);

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

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Redirect Nahtadi to dedicated app page
  if (slug === 'nahtadi') {
    redirect('/nahtadi');
  }

  const project = getProjectById(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {project.id === 'collision-avoidance-radar' ? (
        <>
          {/* Hero Section for Collision Avoidance Radar */}
          <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              {/* App Icon */}
              {project.image && (
                <div className="mb-8 flex justify-center">
                  <div className="w-40 h-40 rounded-3xl shadow-2xl overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.imageAlt || project.title}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* App Name & Tagline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                Collision Avoidance Radar
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-3">
                Maritime Navigation Training Tool
              </p>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Educational application for Coast Guard navigators to practice collision avoidance using radar plotting techniques
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
                  >
                    View on GitHub →
                  </a>
                )}
                <Link
                  href="/projects"
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/30"
                >
                  ← Back to Projects
                </Link>
              </div>

              {/* Stats Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-sm font-medium text-white">{project.stats}</span>
              </div>
            </div>
          </section>

          {/* Technologies Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Built With</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Back button */}
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-800 mb-8 inline-block font-medium transition-colors"
          >
            ← Back to Projects
          </Link>

          {/* Project hero image */}
          {project.image && (
            <div
              className={`relative w-full h-96 mb-8 overflow-hidden flex items-center justify-center ${
                project.id === 'wildfire-predictor'
                  ? 'bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl'
                  : project.id === 'asl-detector'
                  ? 'bg-gradient-to-br from-purple-600 to-purple-400 rounded-3xl'
                  : 'bg-gray-100 rounded-lg'
              }`}
            >
              {project.id === 'wildfire-predictor' || project.id === 'asl-detector' ? (
                <div className="w-60 h-60 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center p-6">
                  <Image
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    width={240}
                    height={240}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              ) : (
                <Image
                  src={project.image}
                  alt={project.imageAlt || project.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          )}

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
        </div>
      )}

      {/* Embedded Streamlit App (if embedUrl exists) */}
      {project.embedUrl && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Interactive Demo
            </h2>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
              <iframe
                src={project.embedUrl}
                className="w-full h-[800px]"
                title={`${project.title} - Interactive Demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              <strong>Note:</strong> The app may take 30 seconds to wake from sleep on first load
              (Streamlit Cloud free tier).
            </p>
          </div>
        </section>
      )}

      {/* Project Details Section - Only for non-collision-radar projects */}
      {project.id !== 'collision-avoidance-radar' && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Links */}
            <div className="flex gap-4 mb-12 justify-center">
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

            {/* Project Details */}
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
        </section>
      )}
    </div>
  );
}
