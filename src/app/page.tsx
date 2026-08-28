import { Metadata } from 'next'
import HomeHero from '@/components/home/HomeHero'
import HomeTicker from '@/components/home/HomeTicker'
import HomeFlagship from '@/components/home/HomeFlagship'
import HomeWork from '@/components/home/HomeWork'
import HomeCTA from '@/components/home/HomeCTA'

/** Reused for `description`, `og:` and `twitter:` so the three cannot drift.
 *  148 chars; `Hendaseh` lives here now that it is out of the title text, so
 *  the domain still gets explained somewhere a reader sees it. */
const DESCRIPTION =
  'Hendaseh, the portfolio of Omar Younis: software engineer and problem-solver, with a shipped iOS app, machine learning, and autonomous systems work.';

/**
 * NO `title` HERE, deliberately. Next applies a layout's `title.template` only
 * to CHILD segments, and `app/page.tsx` is the same segment as `app/layout.tsx`
 * -- so the homepage resolves to that layout's `title.default`, which is the
 * full `Omar Younis - Software Engineer · iOS, ML & Autonomous Systems`.
 * Repeating it here would be a second copy to keep in sync for no gain.
 */
export const metadata: Metadata = {
  description: DESCRIPTION,
  keywords: ['Omar Younis', 'Hendaseh', 'Software Engineer', 'iOS', 'Swift', 'SwiftUI', 'Machine Learning', 'Autonomous Systems', 'Data Engineering', 'Python', 'PyTorch', 'AWS'],
  alternates: {
    canonical: 'https://hendaseh.com',
  },
  openGraph: {
    title: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems',
    description: DESCRIPTION,
    url: 'https://hendaseh.com',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems',
    description: DESCRIPTION,
    images: ['/og/site.png'],
  },
}

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <HomeFlagship />
      <HomeWork />
      <HomeCTA />
    </>
  )
}
