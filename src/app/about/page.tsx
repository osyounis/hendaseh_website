import { Metadata } from 'next'
import AboutClient from '@/components/AboutClient'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'About Omar Younis - Software Engineer (iOS & ML) | Hendaseh',
  description: 'Software engineer and problem-solver: a shipped iOS app (Swift/SwiftUI), machine-learning and data-engineering work, and seven years in mechanical engineering. M.S. Computer Science, CSUF (May 2026).',
  keywords: ['Omar Younis', 'Software Engineer', 'iOS', 'Swift', 'Machine Learning', 'Data Engineering', 'CUDA', 'Qualcomm', 'Python', 'AWS'],
  alternates: {
    canonical: 'https://hendaseh.com/about',
  },
  openGraph: {
    title: 'About Omar Younis - Software Engineer (iOS & ML)',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and a mechanical-engineering background.',
    url: 'https://hendaseh.com/about',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'profile',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis — Software Engineer · iOS & Machine Learning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Omar Younis - Software Engineer (iOS & ML)',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and a mechanical-engineering background.',
    images: ['/og/site.png'],
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Omar Younis',
  jobTitle: 'Software Engineer',
  url: 'https://hendaseh.com',
  sameAs: [
    'https://www.linkedin.com/in/omar-younis/',
    'https://github.com/osyounis',
  ],
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'California State University, Fullerton',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'Worcester Polytechnic Institute',
    },
  ],
  knowsAbout: [
    'iOS Development',
    'Swift',
    'SwiftUI',
    'Machine Learning',
    'Data Engineering',
    'Python',
    'PyTorch',
    'Scientific Computing',
    'CUDA',
    'Parallel Computing',
    'AWS',
  ],
}

export default function About() {
  return (
    <>
      <StructuredData data={personSchema} />
      <AboutClient />
    </>
  )
}
