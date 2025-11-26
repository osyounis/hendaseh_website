import type { Metadata } from 'next';
import Image from 'next/image';
import { HiMail, HiDocument } from 'react-icons/hi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'About | Omar Younis',
  description: 'Learn about Omar Younis - transitioning from 10 years in Mechanical Engineering to Software Engineering',
};

export default function About() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Me</h1>
          <p className="text-xl text-gray-600">
            Software Engineer specializing in data engineering, machine learning, and scientific computing
          </p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Background</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I'm Omar Younis, a Software Engineer with a unique journey. After 7 years as a
            Mechanical Engineer working on everything from military defense systems to medical devices,
            I discovered my passion for software development and made the leap into tech.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I'm currently pursuing my Master's degree in Computer Science at California State
            University, Fullerton (graduating May 2026). I recently completed a Software Engineer
            internship at Qualcomm, where I worked on data engineering and ETL pipelines.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            I specialize in data engineering, machine learning, and scientific computing—building
            practical tools that solve real-world problems with measurable impact. My projects have
            been deployed fleet-wide across Coast Guard operations, reducing workflow times from
            weeks to minutes.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Core Expertise</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Data Engineering & ETL Pipelines</li>
                <li>• Machine Learning & Deep Learning</li>
                <li>• Scientific Computing</li>
                <li>• Computer Vision (OpenCV, YOLO)</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Technologies</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Python, C++/C, Java, SQL</li>
                <li>• AWS, Apache Spark, Docker</li>
                <li>• PyTorch, TensorFlow, Scikit-Learn</li>
                <li>• NumPy, Pandas, SciPy</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Highlights</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900">Qualcomm (May 2024 - Aug 2024)</h3>
              <p className="text-gray-700">
                Built ETL pipelines processing 1M+ data points per minute for ML teams.
                Improved development efficiency by 40% through logging and monitoring solutions.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900">Coast Guard Auxiliary</h3>
              <p className="text-gray-700">
                Developed productivity tools deployed fleet-wide across all US Coast Guard Air Stations.
                Received Coast Guard Auxiliary Achievement Medal for measurable impact.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900">Lead Mechanical Engineer</h3>
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

        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            I'm seeking software engineering opportunities in data engineering, machine learning,
            or scientific computing. Feel free to reach out through any of the channels below.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <a
              href="mailto:osyounis@csu.fullerton.edu"
              className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <HiMail className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Email</div>
                <div className="text-sm text-gray-600">osyounis@csu.fullerton.edu</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/omar-younis/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <FaLinkedin className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">LinkedIn</div>
                <div className="text-sm text-gray-600">linkedin.com/in/omar-younis</div>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/osyounis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <FaGithub className="w-8 h-8 text-gray-900 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">GitHub</div>
                <div className="text-sm text-gray-600">github.com/osyounis</div>
              </div>
            </a>

            {/* Resume Download */}
            <a
              href="/resume.pdf"
              download="Omar_Younis_Resume.pdf"
              className="flex items-center gap-4 p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiDocument className="w-8 h-8 flex-shrink-0" />
              <div>
                <div className="font-semibold">Download Resume</div>
                <div className="text-sm text-blue-100">PDF Format</div>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
