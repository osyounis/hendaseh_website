import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import FilterableProjectList from '@/components/projects/FilterableProjectList';

export const metadata: Metadata = {
  title: 'Projects - Software Portfolio | Hendaseh',
  description: 'Portfolio of software engineering projects including data engineering tools, machine learning applications, iOS apps, and scientific computing solutions.',
  keywords: ['Portfolio', 'Software Projects', 'Data Engineering', 'Machine Learning', 'iOS Apps', 'Python Projects'],
  alternates: {
    canonical: 'https://hendaseh.com/projects',
  },
  openGraph: {
    title: 'Projects - Software Portfolio | Hendaseh',
    description: 'Portfolio of software engineering projects',
    url: 'https://hendaseh.com/projects',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Software Portfolio | Hendaseh',
    description: 'Portfolio of software engineering projects',
  },
};

export default function Projects() {
  const projects = getAllProjects();
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-4">Projects</h1>
        <p className="text-xl text-gray-700 mb-6">
          A collection of software engineering projects showcasing expertise in data engineering,
          machine learning, scientific computing, and engineering applications.
        </p>
        <a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#101411] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          View GitHub Profile
        </a>
      </div>

      <FilterableProjectList projects={projects} />

      <div className="mt-12 text-center">
        <p className="text-gray-700 mb-4">Want to see more?</p>
        <a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Visit My GitHub Profile →
        </a>
      </div>
    </div>
  );
}
