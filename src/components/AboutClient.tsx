'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaFilePdf } from 'react-icons/fa';

export default function AboutClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero section with profile image */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
        <Image
          src="/profile.jpg"
          alt="Omar Younis - Software Engineer"
          width={300}
          height={300}
          className="rounded-2xl"
          priority
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Omar Younis</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-4">Software Engineer</p>
          <p className="text-xl text-gray-600">
            Software engineer with a unique perspective—combining 7 years of mechanical engineering
            experience with modern software development expertise.
          </p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Professional Credentials */}
        <section className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Qualifications</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>MS in Computer Science</strong>
                <p className="text-gray-600 text-base">California State University, Fullerton (2026)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>BS in Mechanical Engineering</strong>
                <p className="text-gray-600 text-base">Minor in Aerospace Engineering, Worcester Polytechnic Institute (2016)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>Software Engineer Intern at Qualcomm</strong>
                <p className="text-gray-600 text-base">Data engineering & ETL pipelines (2024)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>7 Years Engineering Experience</strong>
                <p className="text-gray-600 text-base">D&K Engineering, Cobham, and others</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>Coast Guard Achievement Medal</strong>
                <p className="text-gray-600 text-base">Recognition for fleet-wide tool deployment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>Deployed Software in Federal Operations</strong>
                <p className="text-gray-600 text-base">Tools used across all US Coast Guard Air Stations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong>Proven Impact & Results</strong>
                <p className="text-gray-600 text-base">85% efficiency improvements, measurable outcomes</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Journey</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            After 7 years in mechanical engineering working across military defense systems, medical devices,
            and precision manufacturing, I discovered my passion for software development and made the
            transition to tech.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I'm currently pursuing my Master's in Computer Science at California State University, Fullerton
            (graduating May 2026), with recent experience as a Software Engineer Intern at Qualcomm working
            on data engineering and ETL pipelines.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I specialize in data engineering, machine learning, and scientific computing—creating practical
            tools that solve real-world problems with measurable impact. My projects have been deployed
            fleet-wide across Coast Guard operations, reducing workflow times from weeks to minutes and
            delivering quantifiable efficiency improvements.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Core Expertise</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Data Engineering & ETL Pipelines</li>
                <li>• Machine Learning & Deep Learning</li>
                <li>• Scientific Computing</li>
                <li>• Computer Vision (OpenCV, YOLO)</li>
              </ul>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Technologies</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Python, C++/C, Java, SQL</li>
                <li>• AWS, Apache Spark, Docker</li>
                <li>• PyTorch, TensorFlow, Scikit-Learn</li>
                <li>• NumPy, Pandas, SciPy</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Highlights</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900">Software Engineer Intern - Qualcomm</h3>
              <p className="text-gray-600 text-sm mb-2">May 2024 - August 2024</p>
              <p className="text-gray-700">
                Built ETL pipelines processing 1M+ data points per minute for ML teams.
                Improved development efficiency by 40% through logging and monitoring solutions.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900">Flotilla Staff Officer - US Coast Guard Auxiliary</h3>
              <p className="text-gray-600 text-sm mb-2">May 2015 - Present</p>
              <p className="text-gray-700">
                Developed productivity tools deployed fleet-wide across all US Coast Guard Air Stations.
                Received Coast Guard Auxiliary Achievement Medal for measurable impact.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900">Lead Mechanical Engineer - D&K Engineering</h3>
              <p className="text-gray-600 text-sm mb-2">February 2019 - May 2021</p>
              <p className="text-gray-700">
                Led team of 20 engineers in developing ecoATMs, earning $1M contract extension.
                Accelerated project timelines 4x through technical leadership.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What I Build</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            My projects combine engineering rigor with software development, creating practical
            tools with real-world impact:
          </p>
          <ul className="space-y-2 text-gray-700 ml-6">
            <li>
              • <strong>Data Engineering Tools</strong>: ETL pipelines processing millions of data points
            </li>
            <li>
              • <strong>Machine Learning Applications</strong>: Computer vision, NLP, and predictive models
            </li>
            <li>
              • <strong>Scientific Computing</strong>: Astronomical calculations, maritime navigation algorithms
            </li>
            <li>
              • <strong>Engineering Software</strong>: CAD-integrated tools for mechanical design
            </li>
          </ul>
          <p className="text-gray-700 mt-4 leading-relaxed">
            Check out my{' '}
            <a href="/projects" className="text-blue-600 hover:text-blue-800 font-medium">
              projects page
            </a>{' '}
            to see what I've built, or visit my{' '}
            <a
              href="https://github.com/osyounis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              GitHub profile
            </a>{' '}
            to explore the code.
          </p>
        </section>

        {/* Why Choose Hendaseh */}
        <section className="mb-12 p-8 border-2 border-blue-600 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Work With Me</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong className="text-gray-900">Cross-Disciplinary Expertise</strong>
                <p className="text-base">Unique blend of mechanical engineering rigor and modern software development practices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong className="text-gray-900">Proven Impact</strong>
                <p className="text-base">Fleet-wide deployments with measurable results: 85% efficiency gains, week-to-minutes time reductions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong className="text-gray-900">Modern Tech Stack</strong>
                <p className="text-base">Latest frameworks and industry best practices: Python, AWS, PyTorch, Swift, Apache Spark</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong className="text-gray-900">Reliable Delivery</strong>
                <p className="text-base">Strong academic and professional track record with successful project completions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">✓</span>
              <div>
                <strong className="text-gray-900">Clear Communication</strong>
                <p className="text-base">Engineering background enables effective technical communication with stakeholders</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
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
              <HiMail className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Email</div>
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
              <FaLinkedin className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">LinkedIn</div>
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
              <FaGithub className="w-8 h-8 text-gray-900 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">GitHub</div>
                <div className="text-sm text-gray-600">github.com/osyounis</div>
              </div>
            </motion.a>

            {/* Resume Download */}
            <motion.a
              href="/resume.pdf"
              download="Omar_Younis_Resume.pdf"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-4 p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFilePdf className="w-8 h-8 flex-shrink-0" />
              <div>
                <div className="font-semibold">Download Resume</div>
                <div className="text-sm text-blue-100">PDF Format</div>
              </div>
            </motion.a>
          </div>
        </section>
      </div>
    </div>
  );
}
