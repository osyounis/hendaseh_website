import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/projects/ScrollReveal';
import { ChevronLeft, LeadingAffordanceLabel } from '@/components/LinkAffordance';
import { MailIcon } from '@/components/nahtadi/NahtadiIcons';

/** All three description slots are byte-identical and stay that way. */
const DESCRIPTION =
  'Support and frequently asked questions for Nahtadi, the Islamic prayer times and Qibla app for iOS.';

/** `metadata.title` stays the bare page word; the parent layout's
 *  `%s - Nahtadi` template resolves it. OG and Twitter have no template
 *  inheritance, so they spell it out. */
const SOCIAL_TITLE = 'App Support - Nahtadi';

export const metadata: Metadata = {
  title: 'App Support',
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://hendaseh.com/nahtadi/support',
  },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: 'https://hendaseh.com/nahtadi/support',
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

const BODY_ID = 'support-body';

const enter = (delay: number) => ({ '--enter-delay': `${delay}s` }) as CSSProperties;

/*
 * The eight support answers.
 *
 * THESE ARE TECHNICAL INSTRUCTIONS DESCRIBING REAL iOS UI, where literal
 * accuracy outranks concision — which is exactly why three of them changed.
 * The UI they describe moved in the app's v1.2.0, so literal accuracy is what
 * had been lost. Each keeps its structure and its full step-by-step sequence;
 * the edits are surgical:
 *
 *   FAQ 1  the vague method list becomes the counted one, and gains the
 *          `Set Up Again` route.
 *   FAQ 2  gains a LEADING sentence pointing at the guided setup.
 *   FAQ 3  the day-9 reminder is re-described as the fallback it now is.
 *
 * FAQ 1 and 2 ADD a route, they do not remove one: a user who wants to change
 * one setting should not be sent through a seven-screen flow, so both keep
 * their manual instructions in full.
 *
 * Every authority named is the app's own `shortName` — the label the picker
 * actually shows — because the recognition these lists trade on only works if
 * the word on the site is a word in the app. `Turkiye`, not `Diyanet`.
 *
 * All eight `question` strings are unchanged; only answers moved.
 */
const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: 'How do I change the prayer calculation method?',
    answer:
      'Open the app and tap on the Settings tab (gear icon) at the bottom of the screen. Under "Calculation Method," you\'ll see an "Automatic Selection" toggle. When enabled, the app automatically detects your country and selects the appropriate calculation method. You can disable this to manually choose from 22 methods including ISNA (Islamic Society of North America), MWL (Muslim World League), UQU (Umm al-Qura University), EGAS (Egyptian General Authority of Survey), JAKIM (Malaysia) and Turkiye. You can also re-run the guided setup at any time from Settings, then Set Up Again. You can also select your preferred Asr calculation method (Standard or Hanafi).',
  },
  {
    question: 'The prayer times seem incorrect. What should I check?',
    answer: (
      <>
        {/*
          THE GUIDED-SETUP SENTENCE LEADS THIS ANSWER, and the placement is the
          ruling. It was first drafted to sit fourth — after the manual
          diagnosis, before the email fallback — on the reasoning that the order
          should be diagnose, then guided fix, then contact me. Walking the flow
          showed that was wrong: the seven onboarding screens cover location,
          method, adjustments, the Hijri date and notifications, which is EVERY
          item this answer walks through by hand. So it is not a fallback for
          failed diagnosis, it is a shortcut past the whole sequence — and
          placed fourth, most readers would never reach the easiest fix on the
          page's hardest question. `First` below now reads as the first manual
          check for a reader who prefers to do it themselves.
        */}
        The fastest fix is to re-run the guided setup: open Settings, then Set Up Again. It covers
        location, calculation method, adjustments, the Hijri date and notifications, which is every
        check below. First, verify that Location Services are enabled for Nahtadi in your device
        settings (Settings → Nahtadi → Location). Then, check that you&apos;ve selected the
        appropriate calculation method for your region. The app defaults to Automatic Selection,
        which chooses the method based on your detected country. Different Islamic authorities use
        different calculation methods, so you can manually select the one recommended for your area
        by disabling Automatic Selection in the Settings tab. If the times are still incorrect after
        trying these steps, please contact{' '}
        <a
          className="nh-doc-link"
          href="mailto:support@hendaseh.com?subject=Nahtadi Prayer Times Issue&body=Date:%0D%0ALocation (city, state, country):%0D%0ATimezone:%0D%0AWhat the prayer times should be for the provided date:%0D%0A"
        >
          support@hendaseh.com
        </a>{' '}
        with the date, your location (city, state, country), your timezone, and what the times should
        have been.
      </>
    ),
  },
  {
    question: 'How do I enable prayer time notifications?',
    /*
     * THE NUMBERS ARE UNCHANGED AND CORRECT (a 10-day schedule, a day-9
     * reminder); ONLY THE CAUSALITY IS. The old final sentence presented the
     * day-9 reminder as THE mechanism — "on day 9, you'll receive a reminder"
     * — which was true before background refresh shipped. It now silently
     * pushes the 10-day window, so the reminder is a fallback most users will
     * never see, and the old answer told every reader to expect a notification
     * that will probably never arrive.
     *
     * Written as the better story rather than as a grudging correction: it
     * leads with the good news, because "this just works" is what the facts
     * now say.
     */
    answer:
      'Go to the Settings tab (gear icon) at the bottom of the screen. Under "Prayer Notifications," first enable the master "Enable Notifications" toggle. Then, you can individually enable or disable notifications for each prayer time (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha). The app will request notification permission if not already granted. Once enabled, notifications are automatically scheduled for the next 10 days. The app keeps that window topped up in the background, so you normally never need to do anything. A reminder to open the app only appears if it has not refreshed for nine days.',
  },
  {
    question: 'Does Nahtadi require an internet connection?',
    answer:
      'No. Nahtadi works completely offline once installed. All calculations run locally on your device using astronomical algorithms.',
  },
  {
    question: 'How does Nahtadi calculate the Qibla direction?',
    answer:
      "Nahtadi uses your device's GPS location and applies spherical trigonometry to calculate the precise direction to the Kaaba in Mecca. The compass feature uses your device's magnetometer to show the Qibla direction relative to your current orientation. You can access the Qibla compass by tapping the Qibla tab (compass icon) at the bottom of the screen.",
  },
  {
    question: 'Can I use Nahtadi anywhere in the world?',
    // Only the first sentence moved (`Yes!` -> `Yes.`). The rest is technical
    // and stays verbatim.
    answer:
      'Yes. Nahtadi works worldwide. The app supports high-latitude adjustments for locations at ±48.5 degrees latitude (both north and south of the equator) where traditional calculation methods may not work during certain seasons. It also includes multiple calculation methods suitable for different regions, with automatic selection based on your detected country.',
  },
  {
    question: 'Is my data private?',
    answer: (
      <>
        {/* `Absolutely.` stays. Five one-word FAQ openers were flagged as tonal
            uniformity and two were broken; breaking all five would have been
            over-correction. This one sits inside an answer that mirrors the
            privacy policy, and the policy's no-restructure rule extends to any
            text restating it. */}
        Absolutely. Nahtadi does not collect, transmit, or share any personal information. All your
        data (location, settings, preferences) is stored locally on your device using Apple&apos;s
        secure on-device storage (SwiftData). See the{' '}
        <Link className="nh-doc-link" href="/nahtadi/privacy">
          Privacy Policy
        </Link>{' '}
        for complete details.
      </>
    ),
  },
  {
    question: 'How do I view Hijri and Gregorian dates?',
    answer:
      "Both the Hijri and Gregorian dates are automatically displayed at the top of the Prayer Times screen (home tab). You don't need to navigate anywhere special - they're always visible. If you need to adjust the Hijri date (for example, if your local community follows a different moon sighting), you can use the Hijri Date Adjustment option in the Settings tab to shift it by ±3 days.",
  },
];

/**
 * Technical Information.
 *
 * THREE ROWS, NOT FOUR. `App Version / v1.1.0` is deleted: it was already two
 * releases stale, it is the only row that changes every release, a static site
 * cannot self-update it, and a wrong version actively misleads the user most
 * likely to be reading it — someone trying to report a bug. Nobody noticed it
 * was wrong, which is the argument for removal rather than for maintenance.
 *
 * `iOS 17.0+` drifts too, but far more slowly, and it is information a user
 * actually needs BEFORE downloading, so it is kept deliberately. Verified
 * against Apple's public lookup API on 2026-08-29 (`minimumOsVersion` 17.0).
 *
 * `Omar Saed Younis` is VERBATIM and is not an inconsistency with the site's
 * `Omar Younis`: it is exactly what the App Store listing shows, and a user
 * cross-referencing the two needs them to match. It is the legal name in the
 * one place the legal name belongs.
 *
 * The grid that renders this is `auto-fit`, so removing the fourth row cannot
 * strand an empty cell and adding a fifth cannot either.
 */
const specs = [
  { label: 'Platform', value: 'iOS' },
  { label: 'Requirements', value: 'iOS 17.0+' },
  { label: 'Developer', value: 'Omar Saed Younis' },
];

/*
 * /nahtadi/support — a DOCUMENT, like /nahtadi/privacy, and sharing its form.
 *
 * It got no mockup for the same reason: what it needed was token adoption, the
 * affordance-glyph grammar, the entrance cascade and the locked copy. It used
 * raw Tailwind palette colours (bg-gray-50, bg-blue-50, text-blue-600), so it
 * did not respond to theme at all.
 *
 * VOICE: first person singular. `We're here to help!`, `Send us an email`,
 * `our support team` and `See our Privacy Policy` are gone — this is one
 * person, and the corporate plural was claiming a team that does not exist.
 * The plural survives in the privacy policy ONLY, where legal register wants
 * it.
 *
 * NO RESPONSE-TIME PROMISE. `within 24-48 hours` was a published SLA from a
 * solo developer with no way to enforce it. It is removed rather than softened.
 */
export default function SupportPage() {
  return (
    <>
      <div className="page-wrap nh-doc">
        <div id={BODY_ID}>
          <article className="nh-doc-card nh-enter" style={enter(0)}>
            <h1 className="nh-doc-title">Nahtadi App Support</h1>
            <p className="nh-doc-lede">Common questions first. If yours isn&apos;t here, email me.</p>

            <section className="nh-doc-section">
              <h2>Frequently Asked Questions</h2>
              <div className="nh-doc-faq">
                {faqs.map((faq) => (
                  <div key={faq.question} data-reveal>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <article className="nh-doc-card" data-reveal>
            <section className="nh-doc-section">
              <h2>Contact Support</h2>
              <p>Not covered above? Email me.</p>

              <div className="nh-doc-mail">
                <div className="nh-ico">
                  <MailIcon />
                </div>
                <div>
                  <h3>Email Support</h3>
                  <p>Email me and I&apos;ll get back to you.</p>
                  <p>
                    <a
                      className="nh-doc-link"
                      href="mailto:support@hendaseh.com?subject=Nahtadi App Support"
                    >
                      support@hendaseh.com
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="nh-doc-section">
              <h2>Technical Information</h2>
              <dl className="nh-doc-specs">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="nh-doc-section">
              <p>
                Want the details?{' '}
                {/* A `<Link>`, not a raw `<a>`. The same internal route was
                    already a `<Link>` inside the privacy FAQ answer above, so
                    one of the two got a client-side transition and the other a
                    full document load, for no reason. */}
                <Link className="nh-doc-link" href="/nahtadi/privacy">
                  Read the privacy policy
                </Link>
              </p>
            </section>
          </article>
        </div>

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
