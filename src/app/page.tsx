import { Metadata } from 'next'
import HomepageClient from '@/components/HomepageClient'

export const metadata: Metadata = {
  title: 'Hendaseh - Omar Younis | Software Engineer',
  description: 'Hendaseh (Arabic for Engineering) - Portfolio of Omar Younis, Software Engineer specializing in Data Engineering, Machine Learning, and Scientific Computing. Available for full-time opportunities and contract engagements.',
  keywords: ['Omar Younis', 'Hendaseh', 'Software Engineer', 'Data Engineering', 'Machine Learning', 'Python', 'AWS', 'PyTorch', 'iOS Development'],
  alternates: {
    canonical: 'https://hendaseh.com',
  },
  openGraph: {
    title: 'Hendaseh - Omar Younis | Software Engineer',
    description: 'Software Engineer specializing in Data Engineering, Machine Learning, and Scientific Computing',
    url: 'https://hendaseh.com',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/api/og?card=site', width: 1200, height: 630, alt: 'Omar Younis — iOS Engineer · on-device ML' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hendaseh - Omar Younis | Software Engineer',
    description: 'Software Engineer specializing in Data Engineering, Machine Learning, and Scientific Computing',
    images: ['/api/og?card=site'],
  },
}

export default function Home() {
  return <HomepageClient />
}
