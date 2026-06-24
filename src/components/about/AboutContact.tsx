'use client';

import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaFilePdf } from 'react-icons/fa';

export default function AboutContact() {
  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-[#0A1A2F] mb-6">Get in Touch</h2>
      <p className="text-gray-700 mb-8 leading-relaxed">
        Available for full-time software engineering opportunities and contract engagements.
        Feel free to reach out through any of the channels below.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email */}
        <motion.a
          href="mailto:omar@hendaseh.com"
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
        >
          <HiMail className="w-8 h-8 text-[#0093FF] flex-shrink-0" />
          <div>
            <div className="font-semibold text-[#0A1A2F]">Email</div>
            <div className="text-sm text-gray-600">omar@hendaseh.com</div>
          </div>
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          href="https://www.linkedin.com/in/omar-younis/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
        >
          <FaLinkedin className="w-8 h-8 text-[#0077B5] flex-shrink-0" />
          <div>
            <div className="font-semibold text-[#0A1A2F]">LinkedIn</div>
            <div className="text-sm text-gray-600">linkedin.com/in/omar-younis</div>
          </div>
        </motion.a>

        {/* GitHub */}
        <motion.a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
        >
          <FaGithub className="w-8 h-8 text-[#101411] flex-shrink-0" />
          <div>
            <div className="font-semibold text-[#0A1A2F]">GitHub</div>
            <div className="text-sm text-gray-600">github.com/osyounis</div>
          </div>
        </motion.a>

        {/* Resume Download */}
        <motion.a
          href="/omar_younis_resume_2026.pdf"
          download="omar_younis_resume_2026.pdf"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-4 p-6 bg-[#0093FF] text-white rounded-lg hover:bg-[#0075CC] transition-colors"
        >
          <FaFilePdf className="w-8 h-8 flex-shrink-0" />
          <div>
            <div className="font-semibold">Download Resume</div>
            <div className="text-sm text-blue-100">PDF Format</div>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
