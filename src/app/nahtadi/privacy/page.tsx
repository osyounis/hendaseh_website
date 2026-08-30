import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import ScrollReveal from '@/components/projects/ScrollReveal';
import { ChevronLeft, LeadingAffordanceLabel } from '@/components/LinkAffordance';
import Link from 'next/link';

/** All three description slots are byte-identical and stay that way. `the iOS
 *  app` was vague; the replacement carries the keyword phrase without
 *  keyword-stuffing a legal page. */
const DESCRIPTION =
  'Privacy policy for Nahtadi, the Islamic prayer times app for iOS. No data collection, fully offline.';

/** `metadata.title` stays the bare page word — the parent layout's
 *  `%s - Nahtadi` template resolves it. OG and Twitter titles have no template
 *  inheritance, so they spell it out. */
const SOCIAL_TITLE = 'Privacy Policy - Nahtadi';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://hendaseh.com/nahtadi/privacy',
  },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: 'https://hendaseh.com/nahtadi/privacy',
    siteName: 'Nahtadi',
    locale: 'en_US',
    type: 'website',
    images: [
      { url: '/og/nahtadi.png', width: 1200, height: 630, alt: 'Nahtadi - Islamic Prayer Times' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    images: ['/og/nahtadi.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const BODY_ID = 'privacy-body';

const enter = (delay: number) => ({ '--enter-delay': `${delay}s` }) as CSSProperties;

/*
 * /nahtadi/privacy — a DOCUMENT, and built as one.
 *
 * It got no mockup deliberately: what it needed was token adoption, the
 * affordance-glyph grammar, the entrance cascade and the locked copy. It used
 * raw Tailwind palette colours (bg-gray-50, text-gray-700, text-blue-600), so
 * it did not respond to theme at all and was effectively light-only. Every
 * colour now comes from a semantic token; the form lives in
 * `styles/nahtadi.css` under `.nh-doc-*`, shared with /nahtadi/support so the
 * two pages the App Store links to side by side cannot drift apart.
 *
 * THE POLICY BODY IS UNCHANGED except for the single ruled sentence in
 * Children's Privacy. This file makes COMMITMENTS about data handling, and
 * Apple requires the App Store privacy-policy URL to match the app's actual
 * practices — rewriting it for voice is a category error, because restructured
 * sentences quietly change what is being promised. So:
 *
 *   - The formal register stays. Cadence rules do not apply to a legal
 *     document.
 *   - The PLURAL VOICE stays (`We recommend`, `contact us`). It is deliberate
 *     and ruled: legal register is conventionally plural, and the first-person
 *     switch applied to /nahtadi and /nahtadi/support stops at this file's
 *     border. Do not "fix" it to match the other two pages.
 *   - `NOT` and `NEVER` in block capitals stay. That is emphasis in a
 *     commitment, not a style defect.
 *   - The eight section headings stay. They are what a reviewer scans for.
 *   - `Settings → Nahtadi → Location` keeps its arrow. It is literal iOS UI
 *     path notation, not a link affordance, and is exempt from the Unicode
 *     arrow ban that removed the old gallery hint.
 */
export default function PrivacyPolicyPage() {
  /*
   * THE STAMP MUST REFLECT WHEN THE POLICY GOES PUBLIC, NOT WHEN IT WAS
   * WRITTEN. It moved off `February 13, 2026` because the Children's Privacy
   * sentence below changed: a policy whose text changed while its stamp did
   * not is a worse defect than the sentence that was replaced.
   *
   * This is N3's best estimate of the publication date — N3 works on `dev` and
   * the policy is not published until the dev → main merge, which Task B6
   * owns. B6 VERIFIES this at merge and corrects it if the merge slipped.
   * Format is `Month D, YYYY`.
   *
   * No user notification is implied by the change. The replaced sentence
   * NARROWS an overreaching claim and alters no data practice — nothing
   * Nahtadi collects, stores, transmits or shares is different — so the
   * "Changes to This Privacy Policy" terms below are satisfied by this date
   * bump alone. No email, no in-app notice, no App Store submission.
   */
  const lastUpdated = 'August 29, 2026';

  return (
    <>
      <div className="page-wrap nh-doc">
        <div id={BODY_ID}>
          <article className="nh-doc-card nh-enter" style={enter(0)}>
            <h1 className="nh-doc-title">Privacy Policy for Nahtadi</h1>
            <p className="nh-doc-stamp">Last Updated: {lastUpdated}</p>

            <section className="nh-doc-section">
              <h2>Overview</h2>
              <p>
                Nahtadi is committed to protecting your privacy. This app is designed with
                privacy-first principles and does not collect, transmit, or share any personal
                information.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Data Collection</h2>
              <p>
                <strong>
                  Nahtadi does NOT collect, transmit, or share any personal information.
                </strong>
              </p>
              <p>
                The app operates entirely offline and does not communicate with any external servers
                or third-party services. No user data is ever sent from your device.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Data Storage</h2>
              <p>
                All data is stored locally on your device using Apple&apos;s on-device storage
                (SwiftData). This includes:
              </p>
              <ul>
                <li>Prayer time calculations and settings</li>
                <li>Your preferred calculation method</li>
                <li>Location data (never transmitted off your device)</li>
                <li>User preferences and customization settings</li>
                <li>Prayer time notification preferences</li>
              </ul>
              <p>
                This data remains on your device and is never accessed by the developer or any third
                party.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Location Services</h2>
              <p>
                Nahtadi uses location data exclusively for calculating accurate prayer times for your
                current location. This location information:
              </p>
              <ul>
                <li>Is used ONLY for prayer time calculations on your device</li>
                <li>Is NEVER transmitted to external servers or services</li>
                <li>Is stored locally using Apple&apos;s secure on-device storage (SwiftData)</li>
                <li>
                  Can be revoked at any time through device settings:
                  <ul>
                    {/* Literal iOS UI path notation. Exempt from the Unicode
                        arrow ban — grammar v2 governs link affordances, not a
                        description of a settings path the user has to follow
                        on their phone. Do not swap it for a glyph. */}
                    <li>Settings → Nahtadi → Location</li>
                  </ul>
                </li>
              </ul>
              <p>
                Without location access, you can still use the app by manually entering your city or
                coordinates.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Third-Party Services</h2>
              <p>
                Nahtadi does NOT integrate any third-party analytics, advertising, tracking, or data
                collection services. The app functions completely independently without external
                dependencies.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Children&apos;s Privacy</h2>
              <p>
                This app does not knowingly collect information from children under 13 years of age.{' '}
                {/*
                  The second sentence, and the only change to this policy's
                  body. It replaced "Since no data is collected at all, the app
                  is safe for users of all ages." — which inferred a SAFETY
                  claim from a DATA premise, a category error in the one section
                  Apple reads closely. The replacement states only what the rest
                  of the policy already commits to, restricted to the subject of
                  the section, and adds no new promise.

                  The App Store 4+ rating is deliberately NOT cited here: 4+ is
                  a CONTENT rating, and invoking it to support a data claim
                  re-imports the exact error this fix removes. Do not add it in
                  a later pass.
                */}
                Nahtadi collects no personal data from any user, including children.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Changes to This Privacy Policy</h2>
              <p>
                Any updates to this privacy policy will be posted on this page with a revised
                &quot;Last Updated&quot; date. We recommend checking this page periodically for any
                changes.
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <h2>Contact</h2>
              <p>
                If you have any questions about this privacy policy or the Nahtadi app, please
                contact us:
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a className="nh-doc-link" href="mailto:support@hendaseh.com">
                  support@hendaseh.com
                </a>
              </p>
            </section>

            <section className="nh-doc-section" data-reveal>
              <p>
                Nahtadi is developed by{' '}
                <Link className="nh-doc-link" href="/">
                  Hendaseh
                </Link>
              </p>
            </section>
          </article>
        </div>

        {/* chevron-left, the grammar's one LEADING glyph: this is a return, and
            Apple's own back affordance is a chevron rather than an arrow. */}
        <p className="nh-doc-back">
          <Link href="/nahtadi">
            <LeadingAffordanceLabel label="Back to Nahtadi" glyph={<ChevronLeft />} />
          </Link>
        </p>
      </div>

      <ScrollReveal rootId={BODY_ID} />
    </>
  );
}
