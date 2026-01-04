'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                View My Work
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
              >
                Let's Talk
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
              >
                About
              </Link>
            </motion.div>
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
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">Machine Learning & AI</h3>
            <p className="text-gray-700 mb-4">
              Computer vision, deep learning models, and predictive analytics. Building and deploying
              ML solutions with PyTorch, TensorFlow, and production-ready infrastructure.
            </p>
            <Link
              href="/capabilities"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
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
          </motion.div>
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
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px", amount: 0.1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            >
              <Link
                href={project.hasDetailPage ? `/projects/${project.id}` : `/projects`}
                className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors block h-full"
              >
              {project.image && (
                <div
                  className={`relative w-full h-48 flex items-center justify-center ${
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
                      : project.id === 'new-game-plus'
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-500'
                      : project.id === 'reddit-nlp'
                      ? 'bg-gradient-to-br from-blue-500 to-teal-400'
                      : project.id === 'islamic-prayer-time'
                      ? 'bg-gradient-to-br from-green-700 to-green-900'
                      : project.id === 'coast-guard-pilot-tracker'
                      ? 'bg-gradient-to-br from-orange-500 to-blue-600'
                      : project.id === 'coast-guard-inventory'
                      ? 'bg-gradient-to-br from-blue-700 to-orange-400'
                      : project.id === 'cycloidal-drive-creator'
                      ? 'bg-gradient-to-br from-gray-600 to-blue-700'
                      : 'bg-gray-100'
                  }`}
                >
                  {project.id === 'nahtadi' ? (
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : project.id === 'collision-avoidance-radar' ? (
                    <div className="w-32 h-32 rounded-3xl shadow-2xl overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : project.id === 'new-game-plus' || project.id === 'islamic-prayer-time' ? (
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : project.id === 'wildfire-predictor' || project.id === 'asl-detector' || project.id === 'image-watermark-remover' || project.id === 'reddit-nlp' || project.id === 'coast-guard-pilot-tracker' || project.id === 'coast-guard-inventory' || project.id === 'cycloidal-drive-creator' ? (
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center p-3">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        width={128}
                        height={128}
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
              </Link>
            </motion.div>
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/capabilities"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-lg block text-center"
              >
                See What I Can Do
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="/resume.pdf"
                download="Omar_Younis_Resume.pdf"
                className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-md text-lg block text-center"
              >
                View Resume
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
