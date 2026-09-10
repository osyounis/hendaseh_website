import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import {
  AffordanceLabel,
  ArrowDownCircle,
  ArrowUpRight,
} from '@/components/LinkAffordance';
import NewTabHint from '@/components/NewTabHint';
import { GitHubMark, LinkedInMark } from '@/components/BrandMarks';
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
 * Metadata was converged in Task B5: the title is now the bare page word and
 * `app/layout.tsx`'s template resolves it to `Contact - Omar Younis`.
 */

/** Reused for `description`, `og:` and `twitter:`. 125 chars, so it survives
 *  the ~125-char social preview cut intact. The address is in the string on
 *  purpose: for this page the answer IS the address. */
const DESCRIPTION =
  'Reach Omar Younis at omar@hendaseh.com, or on LinkedIn and GitHub. Open to full-time and contract software engineering roles.';

export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  keywords: ['contact', 'hire software engineer', 'contract development', 'software engineering services'],
  alternates: {
    canonical: 'https://hendaseh.com/contact',
  },
  openGraph: {
    title: 'Contact - Omar Younis',
    description: DESCRIPTION,
    url: 'https://hendaseh.com/contact',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Omar Younis',
    description: DESCRIPTION,
    images: ['/og/site.png'],
  },
};

/* The LinkedIn and GitHub marks now come from `@/components/BrandMarks`. They
   had been inlined here, in `ProjectCard.tsx` and in the case-study template,
   and this page's own comment used to explain that this was "for the same
   stated reason" as the others -- which had quietly become an argument for
   keeping four copies of the same path.

   The reason itself still stands and is unchanged: these are hand-held local
   paths, NOT `react-icons`, so no dependency update can change the glyph under
   the page. A local module keeps that guarantee with one copy.

   `.contact-card-mark` is passed explicitly and REPLACES the shared defaults,
   so these three `<svg>` elements render exactly as they did before -- 26px,
   filled with `var(--contact-mark)` rather than `currentColor`. See the note
   on the `className` prop in BrandMarks.tsx.

   The document mark below stays inline: it has one consumer, and moving a
   single-use constant into a shared module is the opposite trade. */

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
              <LinkedInMark className="contact-card-mark" />
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
              <GitHubMark className="contact-card-mark" />
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
