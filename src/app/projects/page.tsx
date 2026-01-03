import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
        <p className="text-xl text-gray-700 mb-6">
          A collection of software engineering projects showcasing expertise in data engineering,
          machine learning, scientific computing, and engineering applications.
        </p>
        <a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          View GitHub Profile
        </a>
      </div>

      <div className="grid gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="md:flex">
              {project.image && (
                <div
                  className={`relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 flex items-center justify-center ${
                    project.id === 'nahtadi'
                      ? 'bg-gradient-to-br from-blue-300 to-blue-500'
                      : project.id === 'collision-avoidance-radar'
                      ? 'bg-gradient-to-br from-gray-900 to-slate-800'
                      : project.id === 'wildfire-predictor'
                      ? 'bg-gradient-to-br from-red-600 to-orange-500'
                      : project.id === 'asl-detector'
                      ? 'bg-gradient-to-br from-purple-600 to-purple-400'
                      : project.id === 'image-watermark-remover'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-400'
                      : 'bg-gray-100'
                  }`}
                >
                  {project.id === 'nahtadi' ? (
                    <div className="w-40 h-40 bg-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : project.id === 'wildfire-predictor' || project.id === 'asl-detector' ? (
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center p-4">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : project.id === 'collision-avoidance-radar' ? (
                    <div className="w-40 h-40 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : project.id === 'image-watermark-remover' ? (
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center p-4">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <Image
                      src={project.image}
                      alt={project.imageAlt || project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              )}
              <div className="p-8 flex-1">
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

                <div className="flex gap-4 flex-wrap">
                  {project.hasDetailPage && (
                    <Link
                      href={`/projects/${project.id}`}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {project.buttonText || 'View Details →'}
                    </Link>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
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
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Visit My GitHub Profile →
        </a>
      </div>
    </div>
  );
}
