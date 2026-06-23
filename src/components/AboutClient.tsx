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
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-2">Omar Younis</h1>
          <p className="text-2xl text-[#0093FF] font-semibold mb-4">Software Engineer · iOS &amp; Machine Learning</p>
          <p className="text-xl text-gray-600">
            I&apos;m a software engineer and problem-solver: I design the solution, then learn whatever
            tool it needs. That approach has carried me from seven years in mechanical engineering
            through machine learning, data engineering, and a privacy-first iOS app I shipped to the
            App Store. The mechanical background isn&apos;t a detour—it&apos;s range: I can speak both
            Mechanical and Software, and translate between the teams on each side.
          </p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Professional Credentials */}
        <section className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6">Qualifications</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>MS in Computer Science</strong>
                <p className="text-gray-600 text-base">California State University, Fullerton (2026)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>BS in Mechanical Engineering</strong>
                <p className="text-gray-600 text-base">Minor in Aerospace Engineering, Worcester Polytechnic Institute (2016)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>Software Engineer Intern at Qualcomm</strong>
                <p className="text-gray-600 text-base">Data engineering & ETL pipelines (2024)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>7 Years Engineering Experience</strong>
                <p className="text-gray-600 text-base">D&K Engineering, Cobham, and others</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>Coast Guard Achievement Medal</strong>
                <p className="text-gray-600 text-base">Recognition for fleet-wide tool deployment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>Deployed Software in Federal Operations</strong>
                <p className="text-gray-600 text-base">Tools used across all US Coast Guard Air Stations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong>Proven Impact & Results</strong>
                <p className="text-gray-600 text-base">85% efficiency improvements, measurable outcomes</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">My Journey</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I spent about seven years as a mechanical engineer across military defense systems, medical
            devices, and precision manufacturing. At D&amp;K Engineering I led a 20-person team building
            the ecoATM kiosk and earned a $1M contract extension. The constant across that work was
            problem-solving: find what the system needs, then build it.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I moved into software the same way. At Elemeno AI I trained a feed-forward neural network
            that improved package-delivery prediction accuracy by 25%, building the data pipelines and
            running the exploratory analysis behind it, deployed on Google Cloud. At Qualcomm I built
            ETL pipelines processing 1M+ data points per minute for ML teams.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            My M.S. in Computer Science at Cal State Fullerton (May 2026) capped it. My graduate project
            parallelized Brent&apos;s root-finding method on the GPU in CUDA, hitting a 35× kernel-level
            speedup on an NVIDIA RTX 3080. It taught me to think in hardware, memory layout, and where
            performance actually comes from.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Most recently I designed and shipped Nahtadi, a privacy-first iOS prayer-times and Qibla
            app, to the App Store—built in SwiftUI/SwiftData, fully on-device, and accessible to WCAG
            standards. iOS is where my newest work lives; machine learning, data engineering, and
            scientific computing sit alongside it as range. That CUDA and on-device work is also
            pointing me toward on-device ML.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">iOS &amp; Apple</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Swift, SwiftUI, SwiftData</li>
                <li>• Xcode, XCTest</li>
                <li>• Accessibility (VoiceOver, Dynamic Type)</li>
                <li>• App Store publishing</li>
              </ul>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Machine Learning &amp; Data</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Python, PyTorch, TensorFlow, scikit-learn</li>
                <li>• NumPy, Pandas, Computer Vision (OpenCV, YOLO)</li>
                <li>• ETL pipelines, AWS, GCP</li>
                <li>• SQL</li>
              </ul>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Scientific &amp; Systems</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• C++, CUDA, parallel computing</li>
                <li>• Numerical &amp; scientific computing</li>
                <li>• Docker, Git, GitHub Actions (CI/CD)</li>
                <li>• pytest, unit testing</li>
              </ul>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Engineering Background</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Mechanical product design</li>
                <li>• SolidWorks / CAD, FEA</li>
                <li>• GD&amp;T, manufacturing</li>
                <li>• A differentiator: I speak both Mechanical and Software</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">Career Highlights</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-[#0093FF] pl-4">
              <h3 className="font-bold text-[#0A1A2F]">Software Engineer Intern - Qualcomm</h3>
              <p className="text-gray-600 text-sm mb-2">May 2024 - August 2024</p>
              <p className="text-gray-700">
                Built ETL pipelines processing 1M+ data points per minute for ML teams.
                Improved development efficiency by 40% through logging and monitoring solutions.
              </p>
            </div>
            <div className="border-l-4 border-[#0093FF] pl-4">
              <h3 className="font-bold text-[#0A1A2F]">Machine Learning Engineer - Elemeno AI</h3>
              <p className="text-gray-600 text-sm mb-2">August 2022 - November 2022</p>
              <p className="text-gray-700">
                Trained a feed-forward neural network that improved package-delivery prediction
                accuracy by 25%, with SQL and big-data EDA. Deployed on Google Cloud Platform.
              </p>
            </div>
            <div className="border-l-4 border-[#0093FF] pl-4">
              <h3 className="font-bold text-[#0A1A2F]">Lead Mechanical Engineer - D&K Engineering</h3>
              <p className="text-gray-600 text-sm mb-2">February 2019 - May 2021</p>
              <p className="text-gray-700">
                Led team of 20 engineers in developing ecoATMs, earning $1M contract extension.
                Built Python productivity tools that raised in-house engineering efficiency by roughly 50%.
              </p>
            </div>
            <div className="border-l-4 border-[#0093FF] pl-4">
              <h3 className="font-bold text-[#0A1A2F]">US Coast Guard Auxiliary - Member since 2015</h3>
              <p className="text-gray-600 text-sm mb-2">Flotilla Staff Officer for Operations · 2021 - 2026</p>
              <p className="text-gray-700">
                Developed Python productivity tools deployed fleet-wide across all US Coast Guard Air
                Stations. Received Coast Guard Auxiliary Achievement Medal for measurable impact.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">What I Build</h2>
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
        <section className="mb-12 p-8 border-2 border-[#0093FF] rounded-lg">
          <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6">Why Work With Me</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong className="text-[#0A1A2F]">Cross-Disciplinary Expertise</strong>
                <p className="text-base">Unique blend of mechanical engineering rigor and modern software development practices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong className="text-[#0A1A2F]">Proven Impact</strong>
                <p className="text-base">Fleet-wide deployments with measurable results: 85% efficiency gains, week-to-minutes time reductions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong className="text-[#0A1A2F]">Modern Tech Stack</strong>
                <p className="text-base">Latest frameworks and industry best practices: Swift/SwiftUI, Python, PyTorch, AWS, CUDA</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong className="text-[#0A1A2F]">Reliable Delivery</strong>
                <p className="text-base">Strong academic and professional track record with successful project completions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0093FF] font-bold text-xl">✓</span>
              <div>
                <strong className="text-[#0A1A2F]">Clear Communication</strong>
                <p className="text-base">Engineering background enables effective technical communication with stakeholders</p>
              </div>
            </div>
          </div>
        </section>

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
      </div>
    </div>
  );
}
