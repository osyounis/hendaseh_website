import { Metadata } from 'next'
import AboutClient from '@/components/AboutClient'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'About Omar Younis - Software Engineer | Hendaseh',
  description: 'Software engineer with 7 years of mechanical engineering experience, currently pursuing MS in Computer Science. Specializing in data engineering, machine learning, and scientific computing.',
  keywords: ['Omar Younis', 'Software Engineer', 'Data Engineering', 'Machine Learning', 'Qualcomm', 'Coast Guard', 'Python', 'AWS'],
  alternates: {
    canonical: 'https://hendaseh.com/about',
  },
  openGraph: {
    title: 'About Omar Younis - Software Engineer',
    description: 'Software engineer specializing in data engineering, ML, and scientific computing',
    url: 'https://hendaseh.com/about',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Omar Younis - Software Engineer',
    description: 'Software engineer specializing in data engineering, ML, and scientific computing',
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
    'Data Engineering',
    'Machine Learning',
    'Python',
    'AWS',
    'PyTorch',
    'Scientific Computing',
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
