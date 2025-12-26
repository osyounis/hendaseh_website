import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProjects } from '@/lib/projects';

export default function Home() {
  const featuredProjects = getFeaturedProjects(); // All featured projects appear on homepage
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-2">
              Hendaseh
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700">
              Software Engineering & Product Development
            </p>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed">
            Building intelligent software solutions—from iOS applications to enterprise
            data infrastructure.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Available for full-time opportunities and contract engagements.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              View My Work
            </Link>
            <a
              href="mailto:omar@hendaseh.com"
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
            >
              Let's Talk
            </a>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What I Can Do</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          I build practical software solutions—from custom enterprise systems to consumer iOS applications.
          Available for full-time opportunities and contract engagements.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Software Development</h3>
            <p className="text-gray-700 mb-4">
              Internal tools, productivity applications, and API integrations. Deployed solutions
              used across federal operations with measurable impact.
            </p>
            <Link
              href="/capabilities"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Data Engineering</h3>
            <p className="text-gray-700 mb-4">
              ETL pipelines processing millions of data points, cloud infrastructure,
              and big data solutions for ML teams and analytics platforms.
            </p>
            <Link
              href="/capabilities"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile App Development</h3>
            <p className="text-gray-700 mb-4">
              iOS applications built with Swift and SwiftUI. From concept to App Store
              launch, delivering polished products users love.
            </p>
            <Link
              href="/capabilities"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
          <Link
            href="/projects"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
            >
              {project.image && (
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dual CTAs - Ready to Collaborate */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Collaborate?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Whether you're looking to hire for a full-time position or need custom software solutions,
            I'd love to discuss how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/capabilities"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-lg"
            >
              See What I Can Do
            </Link>
            <a
              href="/resume.pdf"
              download="Omar_Younis_Resume.pdf"
              className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-md text-lg"
            >
              View Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
