import { Fragment, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjectById, getCaseStudyProjects, getNextCaseStudy } from '@/lib/projects';
import {
  getCaseStudy,
  type CaseStudySection as CaseStudySectionData,
  type Prose,
} from '@/lib/caseStudies';
import ScrollReveal from '@/components/projects/ScrollReveal';
import NewTabHint from '@/components/NewTabHint';
import {
  AffordanceLabel,
  ArrowUpRight,
  ChevronLeft,
  LeadingAffordanceLabel,
} from '@/components/LinkAffordance';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * ONE TEMPLATE. There is no per-project branch anywhere below, and adding one
 * would be a regression: this page used to be two hand-written layouts whose
 * hardcoded `<h1>` strings had drifted away from `project.title`, so the
 * visible title and the `<title>` tag disagreed. Everything here is driven by
 * `projects.json` (via the `src/lib/projects.ts` helpers) and by
 * `src/lib/caseStudies.ts`.
 *
 * The only conditionals are on DATA PRESENCE, not on identity:
 *   - `links.github`  -> the GitHub button
 *   - `caseStudy.figure` -> the media slot (B-B wires the figures)
 *
 * The live-demo button and the in-page embed slot are GONE, with the Streamlit
 * demo they served. That demo had a known correctness bug and is superseded by
 * `radar-moboard`; `/projects/collision-avoidance-radar` now 308s to it. The
 * removal is not only tidiness: `page.goto` waits for `load`, `load` waited for
 * a third-party iframe, and that route took 22.2s against a 30s cap, so
 * whichever e2e test happened to hit it failed on any given run.
 */

/* Octocat, 16x16 viewBox. Inlined rather than imported from `react-icons` so
   the glyph is the exact path the approved mockup draws. The project cards
   carry their own copy of this constant for the same reason. */
const GITHUB_MARK =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z';

/** Per-element delay for the hero entrance cascade (see `.case-enter` in
 *  case-study.css). Hero only -- the body below is `[data-reveal]`, a separate
 *  system, and the two are never mixed on one element. */
const ENTER = (delay: string) => ({ '--enter-delay': delay }) as CSSProperties;

/** The subtree `ScrollReveal` looks inside for `[data-reveal]` elements. */
const BODY_ID = 'case-study-body';

// Enforces the tier contract: only `showcase` projects without their own
// detailPath get a /projects/[slug] page. `card` tier means "no page", and the
// flagship lives at its own frozen URL — without this, every card slug still
// rendered a full self-canonicalising, OG-carded page.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getCaseStudyProjects().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const url = `https://hendaseh.com/projects/${slug}`;
  const ogImage = {
    url: `/og/${slug}.png`,
    width: 1200,
    height: 630,
    alt: project.title,
  };

  // `tagline`, NOT `description`. The full `description` is body copy and runs
  // long -- several run past 260 characters -- so Google (~150-160)
  // and social previews (~125) cut the tail off on every surface. Sub-project 3
  // wrote a `tagline` for all 13 projects at exactly this length (longest in
  // the catalog: 120). Body copy still reads `description`; only meta uses
  // `tagline`. Closes the ROADMAP open question raised 2026-08-26.
  //
  // The bare `title` is resolved to `<title> - Omar Younis` by the root
  // layout's template; `og:`/`twitter:` have no such inheritance and spell the
  // suffix out.
  const socialTitle = `${project.title} - Omar Younis`;

  return {
    title: project.title,
    description: project.tagline,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description: project.tagline,
      url,
      siteName: 'Hendaseh',
      locale: 'en_US',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: project.tagline,
      images: [ogImage.url],
    },
  };
}

/** Renders one paragraph, keeping the approved copy's emphasis runs. */
function Paragraph({ prose }: { prose: Prose }) {
  return (
    <p className="case-p">
      {prose.map((run, index) =>
        typeof run === 'string' ? (
          <Fragment key={index}>{run}</Fragment>
        ) : (
          <strong key={index}>{run.em}</strong>
        )
      )}
    </p>
  );
}

/**
 * PROBLEM / APPROACH / IMPACT all use this. `children` is how the IMPACT
 * section gets its tech chips without the section itself knowing about them.
 */
function CaseStudySection({
  section,
  children,
}: {
  section: CaseStudySectionData;
  children?: React.ReactNode;
}) {
  return (
    <section className="case-section" data-reveal="">
      <span className="section-eyebrow">{section.eyebrow}</span>
      <h2 className="case-heading">{section.heading}</h2>
      {section.paragraphs.map((prose, index) => (
        <Paragraph key={index} prose={prose} />
      ))}
      {children}
    </section>
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectById(slug);

  // `dynamicParams = false` already means only the slugs above resolve, so a
  // miss here is a catalog/content mismatch, not a bad URL. Throwing fails the
  // build loudly instead of quietly prerendering a broken page — the same
  // choice `/projects` makes for a project with no tagline.
  if (!project) {
    throw new Error(`Case study route rendered for unknown project "${slug}".`);
  }

  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) {
    throw new Error(
      `Project "${slug}" is showcase tier but has no entry in src/lib/caseStudies.ts.`
    );
  }

  const next = getNextCaseStudy(slug);

  return (
    <article>
      <header
        className="case-hero"
        style={
          {
            '--case-hero-from': caseStudy.hero.from,
            '--case-hero-to': caseStudy.hero.to,
          } as CSSProperties
        }
      >
        <div className="page-wrap">
          <Link href="/projects" className="case-crumb case-enter" style={ENTER('0s')}>
            <LeadingAffordanceLabel label="All projects" glyph={<ChevronLeft />} />
          </Link>

          <div className="case-hero-row">
            {/* Decorative: the title beside it names the project. */}
            <Image
              src={`/images/projects/${project.id}/icon-squircle.png`}
              alt=""
              width={132}
              height={132}
              className="case-icon case-enter"
              style={ENTER('0.1s')}
              priority
            />

            {/* Title and thesis are ONE beat: one statement, one block, and
                100ms apart they would read as fussy rather than as sequence. */}
            <div className="case-hero-copy case-enter" style={ENTER('0.2s')}>
              <h1 className="case-title">{project.title}</h1>
              <p className="case-thesis">{caseStudy.thesis}</p>
            </div>

            {/* The entrance goes on this WRAPPER, never on the pills inside
                it. `.pill:active` is a `transform`, and an animation's filled
                end state would beat it -- see the block comment on
                `.case-enter` in case-study.css. */}
            <div className="case-actions case-enter" style={ENTER('0.3s')}>
              {/* The repository is the page's only action, so it takes the
                  solid button. The ghost variant existed for the case where a
                  live demo held the primary slot; nothing does now. */}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill case-btn-white"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d={GITHUB_MARK} />
                  </svg>
                  <AffordanceLabel label="GitHub" glyph={<ArrowUpRight />} />
                  <NewTabHint />
                </a>
              )}
            </div>
          </div>

          {/* Three real numbers. Every value is traceable to the project's own
              record; nothing here is rounded up or invented. */}
          <ul className="case-stats case-enter" style={ENTER('0.4s')}>
            {caseStudy.stats.map((stat) => (
              <li key={stat.label} className="case-stat">
                <span className="case-stat-value">{stat.value}</span>
                <span className="case-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div id={BODY_ID} className="page-wrap case-body">
        <CaseStudySection section={caseStudy.problem} />
        <CaseStudySection section={caseStudy.approach} />

        {/* Media slot: 16:9 figure plus caption, reserved for phase-5 charts.
            It renders only when there is real artwork to show. */}
        {caseStudy.figure && (
          <figure className="case-figure" data-reveal="">
            <Image
              src={caseStudy.figure.src}
              alt={caseStudy.figure.alt}
              width={1280}
              height={720}
              className="case-figure-media"
            />
            <figcaption className="case-caption">{caseStudy.figure.caption}</figcaption>
          </figure>
        )}

        <CaseStudySection section={caseStudy.impact}>
          <ul className="case-techrow">
            {project.technologies.map((tech) => (
              <li key={tech} className="case-tech">
                {tech}
              </li>
            ))}
          </ul>
        </CaseStudySection>

        {/* Fixed slots: "All projects" is always on the left, "Next case
            study" always on the right. No border here — the footer's hairline
            is the only rule at the bottom of the page. */}
        <nav className="case-nav" aria-label="Case study">
          <Link href="/projects" className="case-nav-back">
            <LeadingAffordanceLabel label="All projects" glyph={<ChevronLeft />} />
          </Link>

          {next && (
            <Link href={`/projects/${next.id}`} className="home-tile case-nav-next">
              <Image
                src={`/images/projects/${next.id}/icon-squircle.png`}
                alt=""
                width={46}
                height={46}
                className="case-nav-next-icon"
              />
              <span>
                <span className="case-nav-next-label">Next case study</span>
                <span className="case-nav-next-title">{next.title}</span>
              </span>
            </Link>
          )}
        </nav>
      </div>

      <ScrollReveal rootId={BODY_ID} />
    </article>
  );
}
