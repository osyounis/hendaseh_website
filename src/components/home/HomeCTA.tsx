'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomeCTA() {
  return (
    /* Dual CTAs - Ready to Collaborate */
    <section className="py-16 border-t border-gray-200">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] mb-4">
          Ready to Collaborate?
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Whether you're looking to hire for a full-time position or need custom software solutions,
          I'd love to discuss how we can work together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/about"
              className="px-8 py-4 bg-[#0093FF] text-white rounded-lg hover:bg-[#0075CC] transition-colors font-medium shadow-md text-lg block text-center"
            >
              See What I Can Do
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a
              href="/omar_younis_resume_2026.pdf"
              download="Omar_Younis_Resume.pdf"
              className="px-8 py-4 bg-[#0A1A2F] text-white rounded-lg hover:bg-[#0D2847] transition-colors font-medium shadow-md text-lg block text-center"
            >
              View Resume
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
