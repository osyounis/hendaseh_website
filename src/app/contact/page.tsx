import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import {
  AffordanceLabel,
  ArrowDownCircle,
  ArrowUpRight,
} from '@/components/LinkAffordance';
import NewTabHint from '@/components/NewTabHint';
import CopyEmailButton from '@/components/contact/CopyEmailButton';

/**
 * Contact (Task B4). Contract: docs/superpowers/mockups/contact/APPROVED.md
 * and the v2 pair (v2.html dark canonical, v2-light.html).
 *
 * One idea: THE EMAIL ADDRESS IS THE HERO. No form (removed in sub-project 2),
 * no availability stamp (sitewide decision). Everything else on the page is a
 * second way to reach the same person.
 *
 * This file stays a SERVER component. The only thing here that needs the
 * client is the Copy button, and the boundary is drawn around that button
 * alone -- see the header of `CopyEmailButton.tsx`. The address itself is
 * server-rendered text, so it is readable and selectable with no JavaScript at
 * all, and the copy button is a convenience rather than the only route to it.
 *
 * Shared code, never re-implemented here (the rule that bound B2 and B3):
 *   - `.home-tile` gives every channel card its ground, hairline, hover lift,
 *     focus ring and `:active` press. Each card IS the `<a>`, because the
 *     press response is scoped `a.home-tile:active`.
 *   - `.pill .pill-primary` is the Copy button.
 *   - `LinkAffordance` draws the grammar-v2 glyphs: arrow-up-right on the two
 *     externals, arrow-down-in-circle on the download. Both are `aria-hidden`
 *     and welded to the label's last word by `AffordanceLabel`.
 *   - `NewTabHint` carries the "(opens in a new tab)" the arrow only says
 *     visually.
 *
 * METADATA IS TASK B5's, NOT THIS TASK'S. The block below is untouched --
 * tagline convergence, the description rewrite and the OG regeneration all
 * happen there, in one pass across every page.
 */

export const metadata: Metadata = {
  title: 'Contact - Omar Younis | Software Engineer — iOS & ML',
  description: 'Get in touch with Omar Younis for software engineering opportunities, contract work, or project inquiries.',
  keywords: ['contact', 'hire software engineer', 'contract development', 'software engineering services'],
  alternates: {
    canonical: 'https://hendaseh.com/contact',
  },
  openGraph: {
    title: 'Contact - Omar Younis | Software Engineer — iOS & ML',
    description: 'Get in touch with Omar Younis for software engineering opportunities, contract work, or project inquiries.',
    url: 'https://hendaseh.com/contact',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis — Software Engineer · iOS & Machine Learning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Omar Younis | Software Engineer — iOS & ML',
    description: 'Get in touch with Omar Younis for software engineering opportunities, contract work, or project inquiries.',
    images: ['/og/site.png'],
  },
};

/* Destination marks. Inline rather than pulled from `react-icons` so each
   glyph is the exact path the approved mockup draws, and so the icon set does
   not change under the page when a dependency updates. `ProjectCard.tsx` and
   the case-study template carry their own copies of the octocat for the same
   stated reason. */

/** LinkedIn wordmark glyph, 24x24 viewBox. */
const LINKEDIN_MARK =
  'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z';

/** Octocat, 16x16 viewBox. */
const GITHUB_MARK =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z';

/** Document with a folded corner, 24x24 viewBox. */
const DOCUMENT_MARK =
  'M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM8 13h8v1.6H8V13Zm0 4h8v1.6H8V17Z';

/** Per-element delay for the entrance cascade (see `.contact-enter`). */
const ENTER = (delay: string) => ({ '--enter-delay': delay }) as CSSProperties;

export default function ContactPage() {
  return (
    <section
      className="contact-sky mt-[calc(var(--nav-h)*-1)] pt-[var(--nav-h)]"
      aria-labelledby="contact-title"
    >
      <div className="home-aurora" aria-hidden="true" />

      <div className="page-wrap contact-main">
        <span
          className="section-eyebrow contact-eyebrow contact-enter"
          style={ENTER('0s')}
        >
          CONTACT
        </span>

        <h1 id="contact-title" className="contact-title contact-enter" style={ENTER('0.1s')}>
          Say hello.
        </h1>

        <p className="contact-sub contact-enter" style={ENTER('0.22s')}>
          Email is the fastest way to reach me. Everything below works too.
        </p>

        <div className="contact-mailrow contact-enter" style={ENTER('0.34s')}>
          <div className="contact-mail">
            {/* A `mailto:` (contract amendment, 2026-08-28). The page's own
                thesis is "Email is the fastest way to reach me", and on a
                phone this address was the one thing a thumb would try first
                and the one thing that did nothing. Copy is RETAINED rather
                than replaced: it covers the desktop case where a `mailto:`
                may launch an unconfigured client, so each input type gets the
                affordance that suits it.

                NO AFFORDANCE GLYPH, deliberately -- grammar v2 governs links
                and pills, not display type, and an arrow hung off a 52px
                address would be absurd. The exemption is recorded in the
                contract and ENFORCED by tests/e2e/link-affordance.spec.ts, so
                a later pass cannot "fix" it.

                Plain HTML, so it stays server-rendered: the client boundary
                is still `CopyEmailButton` alone.

                One string with the `@` tinted, not two runs: any gap between
                them would read as a typo in an address. */}
            <a className="contact-addr" href="mailto:omar@hendaseh.com">
              omar<span className="contact-at">@</span>hendaseh.com
            </a>
            <CopyEmailButton />
          </div>
        </div>

        {/* This line is about the button above it and nothing else. */}
        <p className="contact-hint contact-enter" style={ENTER('0.46s')}>
          One tap and it&apos;s in your clipboard.
        </p>

        <ul
          className="contact-grid contact-enter"
          aria-label="Other ways to reach me"
          style={ENTER('0.5s')}
        >
          <li className="contact-cell">
            <a
              className="home-tile contact-card"
              href="https://www.linkedin.com/in/omar-younis/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="contact-card-mark" viewBox="0 0 24 24" aria-hidden="true">
                <path d={LINKEDIN_MARK} />
              </svg>
              <span className="contact-card-text">
                <span className="contact-card-title">
                  <AffordanceLabel label="LinkedIn" glyph={<ArrowUpRight />} />
                  <NewTabHint />
                </span>
                <span className="contact-card-handle">omar-younis</span>
              </span>
            </a>
          </li>

          <li className="contact-cell">
            <a
              className="home-tile contact-card"
              href="https://github.com/osyounis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="contact-card-mark" viewBox="0 0 16 16" aria-hidden="true">
                <path d={GITHUB_MARK} />
              </svg>
              <span className="contact-card-text">
                <span className="contact-card-title">
                  <AffordanceLabel label="GitHub" glyph={<ArrowUpRight />} />
                  <NewTabHint />
                </span>
                <span className="contact-card-handle">osyounis</span>
              </span>
            </a>
          </li>

          <li className="contact-cell">
            {/* The `download` filename is byte-identical to the instances in
                HomeHero, AboutHero and AboutCTA. It is a sitewide rule: the
                file a reader ends up with must be named the same whichever
                page they got it from. */}
            <a
              className="home-tile contact-card"
              href="/omar_younis_resume_2026.pdf"
              download="Omar_Younis_Resume.pdf"
            >
              <svg className="contact-card-mark" viewBox="0 0 24 24" aria-hidden="true">
                <path d={DOCUMENT_MARK} />
              </svg>
              <span className="contact-card-text">
                <span className="contact-card-title">
                  <AffordanceLabel label="Résumé" glyph={<ArrowDownCircle />} />
                </span>
                <span className="contact-card-handle">PDF</span>
              </span>
            </a>
          </li>
        </ul>

        <p className="contact-sign contact-enter" style={ENTER('0.6s')}>
          SUNNYVALE, CA · I READ EVERYTHING
        </p>
      </div>
    </section>
  );
}
