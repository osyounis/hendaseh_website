'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    /* Hero Section */
    <section className="bg-gradient-to-br from-gray-100 to-gray-50 py-20 md:py-32 border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-4xl">
        <div className="mb-6">
          <div className="mb-4">
            <h1 className="sr-only">Hendaseh</h1>
            <Image
              src="/logos/hendaseh-logo.png"
              alt="Hendaseh"
              width={400}
              height={91}
              className="h-12 md:h-16 w-auto"
              priority
            />
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700">
            Software Engineer · iOS &amp; Machine Learning
          </p>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed">
          I&apos;m a software engineer and problem-solver—I design the solution, then learn whatever
          tool it needs. Most recently I shipped Nahtadi, a privacy-first iOS app, to the App Store.
          Alongside that, my work spans machine learning, data engineering, and scientific computing,
          on a foundation of seven years in mechanical engineering.
        </p>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Open to full-time and contract roles across iOS, software, and machine learning.
        </p>
        <div className="flex flex-wrap gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#0093FF] text-white rounded-lg hover:bg-[#0075CC] transition-colors font-medium shadow-md"
            >
              View My Work
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#0A1A2F] text-white rounded-lg hover:bg-[#0D2847] transition-colors font-medium shadow-md"
            >
              Let's Talk
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md"
            >
              About
            </Link>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
}
