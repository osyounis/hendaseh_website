'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getFeaturedProjects } from '@/lib/projects';
import { getProjectGradientClass } from '@/lib/projectStyles';

export default function FeaturedProjects() {
  const featuredProjects = getFeaturedProjects(); // All featured projects appear on homepage
  return (
    /* Featured Projects Preview */
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#0A1A2F]">Featured Projects</h2>
        <Link
          href="/projects"
          className="text-gray-600 hover:text-[#0A1A2F] font-medium transition-colors"
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
              href={project.customUrl || (project.hasDetailPage ? `/projects/${project.id}` : `/projects`)}
              className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors block h-full"
            >
            {project.image && (
              <div
                className={`relative w-full h-48 flex items-center justify-center ${getProjectGradientClass(project.id)}`}
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
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-2">
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
  );
}
