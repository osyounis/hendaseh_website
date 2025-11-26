import Link from 'next/link';
import { getFeaturedProjects } from '@/lib/projects';

export default function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3); // Show first 3 featured projects
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Omar Younis
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed">
            Software Engineer specializing in data engineering, machine learning, and
            scientific computing.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            MS in Computer Science student at Cal State Fullerton (graduating May 2026).
            Former Software Engineer Intern at Qualcomm. Mechanical Engineer with 7 years of experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              About Me
            </Link>
            <a
              href="https://github.com/osyounis"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Background Summary */}
      <section className="py-16 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">What I Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Data Engineering</h3>
            <p className="text-gray-700">
              Building ETL pipelines on AWS processing millions of data points. Creating
              data infrastructure for ML teams and analytics.
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Machine Learning</h3>
            <p className="text-gray-700">
              Developing ML applications with PyTorch and TensorFlow. Computer vision,
              NLP, and predictive modeling for real-world problems.
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Scientific Computing</h3>
            <p className="text-gray-700">
              Creating computational tools using Python. Astronomical algorithms,
              engineering simulations, and mathematical modeling.
            </p>
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
              className="border border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
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
          ))}
        </div>
      </section>
    </div>
  );
}
