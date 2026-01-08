import { Metadata } from 'next'
import CapabilitiesClient from '@/components/CapabilitiesClient'

export const metadata: Metadata = {
  title: 'Capabilities & Services - Software Engineering | Hendaseh',
  description: 'Custom software development, data engineering, machine learning, and mobile app development services. Available for full-time opportunities and contract engagements.',
  keywords: ['Software Development', 'Data Engineering', 'ETL Pipelines', 'Machine Learning', 'iOS Development', 'Python', 'AWS'],
  alternates: {
    canonical: 'https://hendaseh.com/capabilities',
  },
  openGraph: {
    title: 'Capabilities & Services - Hendaseh',
    description: 'Custom software development, data engineering, machine learning, and mobile app development',
    url: 'https://hendaseh.com/capabilities',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capabilities & Services - Hendaseh',
    description: 'Custom software development, data engineering, machine learning, and mobile app development',
  },
}

export default function CapabilitiesPage() {
  return <CapabilitiesClient />
}
