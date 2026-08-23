'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomeCapabilities() {
  return (
    /* Capabilities */
    <section className="py-16 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-[#0A1A2F] mb-4">What I Can Do</h2>
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
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Custom Software Development</h3>
          <p className="text-gray-700 mb-4">
            Internal tools, productivity applications, and API integrations. Deployed solutions
            used across federal operations with measurable impact.
          </p>
          <Link
            href="/about"
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
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Data Engineering</h3>
          <p className="text-gray-700 mb-4">
            ETL pipelines processing millions of data points, cloud infrastructure,
            and big data solutions for ML teams and analytics platforms.
          </p>
          <Link
            href="/about"
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
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Machine Learning & AI</h3>
          <p className="text-gray-700 mb-4">
            Computer vision, deep learning models, and predictive analytics. Building and deploying
            ML solutions with PyTorch, TensorFlow, and production-ready infrastructure.
          </p>
          <Link
            href="/about"
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
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">iOS App Development</h3>
          <p className="text-gray-700 mb-4">
            Native iOS applications in Swift and SwiftUI—privacy-first, accessible, and built fully
            on-device. From concept to App Store launch, delivering polished products users love.
          </p>
          <Link
            href="/about"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Learn more →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
