'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/projects';
import { getProjectHref } from '@/lib/projects';
import { getProjectGradientClass } from '@/lib/projectStyles';

interface AnimatedProjectCardProps {
  project: Project;
  index: number;
}

export default function AnimatedProjectCard({ project, index }: AnimatedProjectCardProps) {
  // Skip scroll animation for first card (already visible on page load)
  const shouldAnimate = index > 0;

  return (
    <motion.div
      /*
       * The resting state is VISIBLE. The reveal is an enhancement layered on
       * top, never a gate.
       *
       * This used to start at `opacity: 0` and rely on `whileInView` — an
       * IntersectionObserver callback — to raise it to 1. That put the one
       * property that decides whether content exists at all under the control
       * of JavaScript: with JS disabled, with the client chunk failing to load
       * on a flaky mobile connection, or with an observer callback that never
       * fires, twelve of the thirteen cards server-rendered blank. That is the
       * "only Nahtadi's image renders" report from the 2026-08-26 phone review.
       *
       * Opacity is therefore pinned at 1 in every state and the reveal animates
       * `y` alone, so the trigger, easing, duration and stagger are unchanged
       * for everyone whose JavaScript runs, and a card is legible even when
       * nothing on the JS path ever executes. Guarded by
       * `tests/e2e/projects-no-js.spec.ts`. (Task B2 owns rebuilding this
       * reveal properly when it redesigns /projects.)
       */
      initial={{ opacity: 1, y: shouldAnimate ? 10 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px", amount: 0.1 }}
      transition={{ duration: 0.3, delay: shouldAnimate ? Math.min(index * 0.05, 0.2) : 0 }}
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
      className="border border-gray-300 rounded-lg overflow-hidden hover:border-[#0093FF] transition-colors"
      data-testid="project-card"
    >
      <div className="md:flex">
        {project.image && (
          <div
            className={`relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 ${getProjectGradientClass(project.id)}`}
          >
            <Image
              src={project.image}
              alt={project.imageAlt || project.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-8 flex-1">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#0A1A2F]">{project.title}</h2>
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
            {getProjectHref(project) && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={getProjectHref(project)!}
                  className="px-6 py-2 bg-[#0093FF] text-white rounded-lg hover:bg-[#0075CC] transition-colors font-medium inline-block"
                >
                  {project.buttonText || 'View Details →'}
                </Link>
              </motion.div>
            )}
            {project.links.github && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#101411] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
              </motion.div>
            )}
            {project.links.live && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border-2 border-[#0A1A2F] text-[#0A1A2F] rounded-lg hover:bg-gray-50 transition-colors font-medium inline-block"
                >
                  Live Demo →
                </a>
              </motion.div>
            )}
            {!project.links.github && !project.links.live && !getProjectHref(project) && (
              <span className="px-6 py-2 text-gray-500 italic">
                Internal/Private Project
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
