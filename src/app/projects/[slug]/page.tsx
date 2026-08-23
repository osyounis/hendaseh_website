import { getProjectById, getAllProjects } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects
    .filter(p => p.tier === 'showcase' && !p.detailPath)
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

  const url = `https://hendaseh.com/projects/${slug}`;
  const ogImage = {
    url: `/api/og?card=${slug}`,
    width: 1200,
    height: 630,
    alt: project.title,
  };

  return {
    title: `${project.title} | Omar Younis`,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} | Omar Younis`,
      description: project.description,
      url,
      siteName: 'Hendaseh',
      locale: 'en_US',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Omar Younis`,
      description: project.description,
      images: [ogImage.url],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

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
                Maritime Collision Avoidance Training System
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-3">
                Maritime Navigation Training Tool
              </p>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Educational application for Coast Guard navigators to practice collision avoidance using radar plotting techniques
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white text-[#0A1A2F] rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
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
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6 text-center">Built With</h2>
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
      ) : project.id === 'brent-cuda' ? (
        <>
          {/* Hero Section for Brent's Method with CUDA */}
          <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              {/* Project Name & Tagline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                Parallelizing Brent&apos;s Method with CUDA
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-3">
                M.S. Graduate Project · GPU-Accelerated Root-Finding
              </p>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                A first CUDA implementation of Brent&apos;s root-finding method — batch/ensemble parallelism running one independent solver per GPU thread.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white text-[#0A1A2F] rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
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

          {/* Headline Results */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-8 text-center">Headline Results</h2>
              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-8 bg-blue-50 rounded-2xl">
                  <div className="text-5xl font-bold text-[#0093FF] mb-2">35.31×</div>
                  <p className="text-gray-700 font-medium">
                    Kernel speedup over the single-threaded CPU baseline
                  </p>
                </div>
                <div className="text-center p-8 bg-blue-50 rounded-2xl">
                  <div className="text-5xl font-bold text-[#0093FF] mb-2">8.79×</div>
                  <p className="text-gray-700 font-medium">
                    End-to-end speedup — median of 10 trials on an RTX 3080 at a 2<sup>22</sup> batch
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Built With */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6 text-center">Built With</h2>
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

          {/* What It Is / Correctness / Methodology */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
              <h2>What It Is</h2>
              <p>
                Brent&apos;s method is a robust scalar root-finder, but a single root solve is
                inherently sequential. This project parallelizes it the other way — across problems
                rather than within one — using batch/ensemble parallelism: each GPU thread runs its
                own independent Brent&apos;s instance. Batch sizes sweep from 2<sup>10</sup> up to
                2<sup>22</sup> (~4.19M independent problems at the top end), saturating the device
                with millions of concurrent solves. It is, to my knowledge, the first CUDA
                implementation of Brent&apos;s method.
              </p>

              <h2>Correctness &amp; Rigor</h2>
              <p>
                Performance only counts if the answers are exact. The CPU and GPU paths produce
                bit-identical fp64 results, validated to &lt;1e-10 against a Python ground-truth
                reference across all three languages — Python, C++, and CUDA. The test battery covers
                22 hand-crafted cases, 16,384 randomly generated monotonic cubics, and edge cases,
                exercised on both the CPU and GPU paths.
              </p>

              <h2>Benchmarking Methodology</h2>
              <p>
                Each batch size runs 3 warmup trials followed by 10 measured trials, reported as the
                median, with an automatic retry whenever the coefficient of variation exceeds 5% to
                keep timings stable. Benchmarks were collected on an NVIDIA RTX 3080 (Ampere, SM 8.6)
                with CUDA Toolkit 13.1. Headline figures: 35.31× at the kernel level and 8.79×
                end-to-end at the 2<sup>22</sup> batch.
              </p>

              <h2>Source Code &amp; Report</h2>
              <p>
                The complete source is on{' '}
                <a
                  href={project.links.github ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  GitHub
                </a>{' '}
                (GPL-3.0). The repository also includes the full written report, presentation slides,
                and raw benchmarks under <code>docs/</code>.
              </p>
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
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-4">
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

      {/* Embedded Streamlit App (if links.embed exists) */}
      {project.links.embed && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0A1A2F] mb-6 text-center">
              Interactive Demo
            </h2>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
              <iframe
                src={project.links.embed}
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

      {/* Project Details Section - Only for projects without a custom layout */}
      {project.id !== 'collision-avoidance-radar' && project.id !== 'brent-cuda' && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Links */}
            <div className="flex gap-4 mb-12 justify-center">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#101411] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium"
                >
                  View on GitHub →
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-[#101411] text-[#0A1A2F] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Open in New Tab →
                </a>
              )}
            </div>

            {/* Project Details */}
            <div className="prose prose-lg max-w-none">
              <h2>About This Project</h2>
              <p>{project.description}</p>

              {project.links.github && (
                <div className="mt-6">
                  <h3>Source Code</h3>
                  <p>
                    The complete source code for this project is available on{' '}
                    <a
                      href={project.links.github}
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
