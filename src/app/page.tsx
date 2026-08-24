import { Metadata } from 'next'
import HomepageClient from '@/components/HomepageClient'

export const metadata: Metadata = {
  title: 'Hendaseh - Omar Younis | Software Engineer — iOS & ML',
  description: 'Hendaseh (Arabic for Engineering) — portfolio of Omar Younis, a software engineer and problem-solver. Ships iOS apps in Swift/SwiftUI, with machine-learning, data-engineering, and scientific-computing range. Open to full-time and contract roles.',
  keywords: ['Omar Younis', 'Hendaseh', 'Software Engineer', 'iOS', 'Swift', 'SwiftUI', 'Machine Learning', 'Data Engineering', 'Python', 'PyTorch', 'AWS'],
  alternates: {
    canonical: 'https://hendaseh.com',
  },
  openGraph: {
    title: 'Hendaseh - Omar Younis | Software Engineer — iOS & ML',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and scientific computing.',
    url: 'https://hendaseh.com',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis — Software Engineer · iOS & Machine Learning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hendaseh - Omar Younis | Software Engineer — iOS & ML',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and scientific computing.',
    images: ['/og/site.png'],
  },
}

export default function Home() {
  return <HomepageClient />
}
