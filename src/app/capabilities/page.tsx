import type { Metadata } from 'next';
import Link from 'next/link';
import { HiCode, HiDatabase, HiDeviceMobile } from 'react-icons/hi';

export const metadata: Metadata = {
  title: 'Capabilities - Software Engineering Expertise | Omar Younis',
  description: 'Software engineering capabilities: custom software development, data engineering, and mobile app development. Available for full-time roles and contract projects.',
  keywords: ['software engineering', 'custom software', 'iOS development', 'data engineering', 'contract development'],
};

export default function CapabilitiesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <section className="mb-16 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          My Capabilities
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          I specialize in building software solutions across three key areas. Whether you're
          looking to hire for a full-time position or need custom development for a specific
          project, here's what I can do.
        </p>
      </section>

      {/* Service Cards Grid */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Custom Software Development */}
        <div className="p-8 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
          <div className="mb-4">
            <HiCode className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Custom Software Development
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Internal tools and productivity applications designed to streamline your operations.
            Desktop utilities, command-line tools, and API development tailored to your workflow.
          </p>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Example:</strong> Coast Guard Pilot Training Tracker</p>
            <p className="text-gray-500">Deployed fleet-wide across all US Coast Guard Air Stations, reducing processing time from 1 week to 3 minutes.</p>
          </div>
        </div>

        {/* Data Engineering */}
        <div className="p-8 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
          <div className="mb-4">
            <HiDatabase className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Data Engineering & Infrastructure
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            ETL pipeline development, data warehouse architecture, and cloud infrastructure.
            Processing millions of data points with reliability and performance.
          </p>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Example:</strong> Qualcomm ETL Pipelines</p>
            <p className="text-gray-500">Built pipelines processing 1M+ data points per minute for ML teams, improving development efficiency by 40%.</p>
          </div>
        </div>

        {/* Mobile App Development */}
        <div className="p-8 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
          <div className="mb-4">
            <HiDeviceMobile className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Mobile Application Development
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            iOS applications built with Swift and SwiftUI. From concept to App Store launch,
            delivering polished products that users love.
          </p>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Example:</strong> Nahtadi Prayer Times App</p>
            <p className="text-gray-500">iOS app using advanced astronomical algorithms for accurate prayer times and Qibla direction.</p>
          </div>
        </div>
      </section>

      {/* Technologies & Expertise */}
      <section className="mb-16 py-12 px-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Technologies & Expertise
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Languages & Frameworks</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Python, Swift, C++/C, Java</li>
              <li>• PyTorch, TensorFlow, Scikit-Learn</li>
              <li>• SwiftUI, Streamlit, FastAPI</li>
              <li>• NumPy, Pandas, Apache Spark</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cloud & Infrastructure</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• AWS (S3, Lambda, DynamoDB)</li>
              <li>• Google Cloud Platform</li>
              <li>• Docker containerization</li>
              <li>• SQL & NoSQL databases</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How I Work
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Consultation</h3>
            <p className="text-gray-600 text-sm">
              Discuss your needs, goals, and technical requirements
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Proposal</h3>
            <p className="text-gray-600 text-sm">
              Detailed scope, timeline, and custom quote for your project
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Development</h3>
            <p className="text-gray-600 text-sm">
              Regular updates and collaboration throughout the build process
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delivery</h3>
            <p className="text-gray-600 text-sm">
              Thorough testing, deployment, and ongoing support
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-8 bg-gray-900 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Let's Talk</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Interested in working together? Reach out to discuss opportunities—whether it's
          a full-time position or a specific project you need help with.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:omar@hendaseh.com"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-lg"
          >
            Schedule a Consultation
          </a>
          <Link
            href="/projects"
            className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-md text-lg"
          >
            View My Work
          </Link>
        </div>
      </section>
    </div>
  );
}
