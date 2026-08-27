import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import { getCategoryChips } from '@/lib/projectCategories';
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
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis — Software Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Software Portfolio | Hendaseh',
    description: 'Portfolio of software engineering projects',
    images: ['/og/site.png'],
  },
};

/** Flagship, then showcase, then card; catalog order inside each tier. Tier is
 *  the page's information structure, so it is the grid's structure too: the
 *  full-width flagship band leads, the two projects with a story to read
 *  follow, and the rest of the catalog runs in its own order underneath. */
const TIER_ORDER = { flagship: 0, showcase: 1, card: 2 } as const;

export default function Projects() {
  const projects = [...getAllProjects()].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]
  );

  // Every card renders `tagline` as its description. A project without one
  // would render a titled card with no description at all, so this fails the
  // build instead: /projects is statically prerendered.
  const untagged = projects.filter((p) => !p.tagline).map((p) => p.id);
  if (untagged.length > 0) {
    throw new Error(
      `Projects page: no tagline in projects.json for "${untagged.join('", "')}".`
    );
  }

  return (
    <>
      {/* The tinted band reaches up under the transparent nav, same as the
          Home hero's sky, so the ground starts at the top of the viewport
          instead of at a seam below the logo. */}
      <header className="projects-sky mt-[calc(var(--nav-h)*-1)] pt-[calc(var(--nav-h)+40px)] pb-8">
        <div className="page-wrap">
          <span className="section-eyebrow">PROJECTS</span>
          {/* Count-free by rule: no number here can go stale when a project is
              added. The only count on this page is the computed line above
              the grid. */}
          <h1 className="text-primary mt-2.5 text-[clamp(34px,5vw,54px)] leading-[1.1] font-black tracking-[-0.015em]">
            Everything I&apos;ve built.
          </h1>
          <p className="text-muted mt-3.5 max-w-[56ch] leading-[1.6]">
            iOS apps, ML models, GPU kernels, and the tools in between. Case studies where there
            is a real story to tell. Straight to the code everywhere else.
          </p>
        </div>
      </header>

      <FilterableProjectList projects={projects} chips={getCategoryChips(projects)} />
    </>
  );
}
