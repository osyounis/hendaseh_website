import { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import ScrollReveal from '@/components/projects/ScrollReveal'
import AboutHero from '@/components/about/AboutHero'
import AboutArc from '@/components/about/AboutArc'
import AboutHighlights from '@/components/about/AboutHighlights'
import AboutEducation from '@/components/about/AboutEducation'
import AboutOffTheClock from '@/components/about/AboutOffTheClock'
import AboutCTA from '@/components/about/AboutCTA'

/** Reused for `description`, `og:` and `twitter:`. 154 chars. Leads with the
 *  arc, because that is what is distinctive; the degree comes after.
 *
 *  IT FIXES TWO THINGS. The old plural `iOS apps` contradicted the canonical
 *  fact (one shipped app, Nahtadi) AND contradicted the Home description
 *  written in the same pass, which says `a shipped iOS app`; both now say the
 *  same true thing. The broken parallel is gone too — `to shipping iOS apps,
 *  machine learning, and autonomous systems work` parsed as "shipping machine
 *  learning". `a full retrain` echoes About's own locked hero copy.
 *
 *  `M.S. Computer Science, CSU Fullerton` is preserved in full: the degree is
 *  a canonical fact and `Computer Science` is a keyword phrase, so it was not
 *  abbreviated to fit. */
const DESCRIPTION =
  'Seven years in mechanical engineering, then a full retrain: a shipped iOS app, machine learning, autonomous systems. M.S. Computer Science, CSU Fullerton.';

/** `title` is the bare page word; `app/layout.tsx`'s template resolves it to
 *  `About - Omar Younis`. `openGraph.title` has to spell that out -- OG has no
 *  template inheritance from the resolved `<title>`. */
export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  keywords: ['Omar Younis', 'Software Engineer', 'iOS', 'Swift', 'Machine Learning', 'Autonomous Systems', 'Data Engineering', 'CUDA', 'Qualcomm', 'Python', 'AWS'],
  alternates: {
    canonical: 'https://hendaseh.com/about',
  },
  openGraph: {
    title: 'About - Omar Younis',
    description: DESCRIPTION,
    url: 'https://hendaseh.com/about',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'profile',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Omar Younis',
    description: DESCRIPTION,
    images: ['/og/site.png'],
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Omar Younis',
  // `jobTitle` stays the plain role. schema.org wants a job title here, not a
  // marketing line, and the specifics live in `description` and `knowsAbout`
  // -- which is where Task B5 aligned them with the surface string.
  jobTitle: 'Software Engineer',
  description:
    'Software engineer and problem-solver. Ships iOS apps in Swift and SwiftUI, with machine-learning, autonomous-systems and data-engineering range, plus seven years in mechanical engineering.',
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
    'Autonomous Systems',
    'Data Engineering',
    'Python',
    'PyTorch',
    'Scientific Computing',
    'CUDA',
    'Parallel Computing',
    'AWS',
  ],
}

/** The subtree `ScrollReveal` looks inside for `[data-reveal]` elements. The
 *  hero is deliberately outside it: it has its own entrance cascade and is
 *  always above the fold, so it is never armed. */
const BODY_ID = 'about-body'

export default function About() {
  return (
    <>
      <StructuredData data={personSchema} />

      <AboutHero />

      <div id={BODY_ID}>
        <AboutArc />
        <AboutHighlights />
        {/* Education and Off the clock share one band of page padding, the way
            the approved mockup lays them out; the closing card sits inside it
            so its 40px top margin reads against the last card grid. */}
        <div className="page-wrap about-edu">
          <AboutEducation />
          <AboutOffTheClock />
          <AboutCTA />
        </div>
      </div>

      <ScrollReveal rootId={BODY_ID} />
    </>
  )
}
