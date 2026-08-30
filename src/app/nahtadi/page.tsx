import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getNahtadiReviews } from '@/lib/projects';
import FeatureCard from '@/components/nahtadi/FeatureCard';
import PlatformButtons from '@/components/nahtadi/PlatformButtons';
import ScreenshotGallery from '@/components/nahtadi/ScreenshotGallery';
import ReviewsCarousel from '@/components/nahtadi/ReviewsCarousel';
import ScrollReveal from '@/components/projects/ScrollReveal';
import { AffordanceLabel, ChevronRight } from '@/components/LinkAffordance';
import {
  BellIcon,
  CalendarIcon,
  ClockIcon,
  CompassIcon,
  GearIcon,
  GlobeIcon,
  HelpIcon,
  PlusMark,
  ShieldCheckIcon,
  ShieldIcon,
  SignalIcon,
} from '@/components/nahtadi/NahtadiIcons';

/*
 * /nahtadi — the flagship product page.
 *
 * VISUAL CONTRACT: docs/superpowers/mockups/nahtadi/APPROVED.md, built to the
 * v4 mockup pair. Layout, spacing and colour rationale live in
 * src/app/styles/nahtadi.css beside the rules they explain.
 *
 * COPY: docs/superpowers/mockups/nahtadi/COPY-LOCKED.md. EVERY STRING BELOW IS
 * LIFTED FROM A ROW IN THAT DOCUMENT, NOT FROM THE MOCKUP. Where the two
 * disagree the document wins, and they do currently disagree in two places:
 * v4.html was drawn before rows J1 and K1 were locked, so it still renders
 * slot 3 as "Choose the method your region follows." and slot 6 as
 * "Offline Mode" / "Works without internet, using your last known location."
 * — the latter now sitting over an onboarding screenshot. The mockup is a
 * VISUAL contract; it is not a copy source, and it is deliberately not being
 * "fixed" to match.
 *
 * The page is a server component. Only the carousel and the rail are clients,
 * because only they need state.
 *
 * FROZEN URL. The App Store links here. No route, slug, canonical tag or
 * sitemap entry is touched by this file.
 */

/** Where the scroll reveal is armed. The hero is deliberately OUTSIDE it: it
 *  has its own entrance cascade and is always above the fold. */
const BODY_ID = 'nahtadi-body';

/**
 * The four FAQ answers, and the source of the FAQPage JSON-LD.
 *
 * `faqLd` is built from this array by `.map()`, so the structured data cannot
 * drift from what the page shows. Do not hand-write a second copy.
 *
 * That propagation is also why the price lives in the first answer (row A1).
 * Google surfaces FAQ answers DETACHED from the page, where the One-Time
 * Purchase card does not exist — an answer to "Why isn't it free?" that never
 * states the price would be priceless again in exactly the context the row was
 * written to fix. The card and the answer are additive, not duplicative, and
 * both are the same fact as `offers.price` below: change one, change all.
 */
const faqs = [
  {
    q: "Why isn't it free?",
    a: 'Many prayer apps are free because they make money from ads and your data. Your worship should not be a revenue stream. Nahtadi is a one-time $3.99 purchase: no ads, so there is nothing to gain from tracking you, and no subscription prompts arriving in the middle of salat.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Nahtadi collects zero personal data. Your location, settings, and preferences stay on your device. There are no analytics, no third-party trackers, and no accounts to create.',
  },
  {
    q: 'Does it work without internet?',
    a: 'Prayer times are calculated on your device using astronomical algorithms, so Nahtadi works offline anywhere in the world once installed.',
  },
  {
    // 22 is counted from source (CalculationMethods.swift), not estimated, and
    // every authority named here is the app's own `shortName` — the label its
    // picker actually shows. That rule is load-bearing: the recognition this
    // sentence trades on only works if the word on the site is a word in the
    // app, so "Diyanet" is deliberately "Turkiye" and "Kemenag (Indonesia)" is
    // deliberately "Indonesia (Kemenag)".
    q: 'Which calculation methods are supported?',
    a: 'Nahtadi supports 22 calculation methods, including ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), the Egyptian General Authority (EGAS), JAKIM (Malaysia), Turkiye and Indonesia (Kemenag). Setup walks you through choosing one the first time you open the app, and you can run it again from Settings. It also applies high-latitude adjustments beyond 48.5 degrees north or south, where the standard methods can fail during certain seasons.',
  },
];

/** Titles are unchanged from the original page; only descriptions moved. */
const features = [
  {
    icon: <ClockIcon />,
    title: '5 Daily Prayer Times',
    description:
      'Accurate calculations for Fajr, Dhuhr, Asr, Maghrib, and Isha using astronomical algorithms.',
  },
  {
    icon: <CompassIcon />,
    title: 'Qibla Direction',
    description:
      'Points to the Kaaba in Mecca from anywhere in the world, using your device compass.',
  },
  {
    icon: <CalendarIcon />,
    title: 'Hijri Calendar',
    description: 'Hijri and Gregorian dates together, with a converter for any date.',
  },
  {
    icon: <BellIcon />,
    title: 'Prayer Notifications',
    description: 'A reminder for each prayer, switched on or off individually.',
  },
  {
    icon: <SignalIcon />,
    title: 'Fully Offline',
    description: 'Calculated on your device. No internet connection required.',
  },
  {
    icon: <GlobeIcon />,
    title: 'Works Worldwide',
    // Deliberately NOT given the method count: this card's claim is about
    // LATITUDE, not about regional authorities. Putting 22 here would
    // duplicate the card below and blur two different facts.
    description: 'Works at any latitude, with adjustments beyond 48.5 degrees north or south.',
  },
  {
    icon: <GearIcon />,
    title: 'Multiple Calculation Methods',
    // The LIST does more work than the count. 22 is a number; ISNA, MWL,
    // JAKIM, Turkiye is a claim of worldwide reach that a specific reader
    // recognises — and naming two non-obvious ones is what turns "and more"
    // into evidence for exactly the users a generic list leaves out.
    description: '22 methods, from ISNA and MWL to JAKIM and Turkiye. Pick the one your region follows.',
  },
  {
    icon: <ShieldCheckIcon />,
    title: 'Privacy First',
    description: 'All data stays on your device. No tracking and no data collection.',
  },
];

/**
 * The six App Store screenshots, in slot order.
 *
 * The binaries were re-captured from the live app at v1.2.1 on 2026-08-29 and
 * caption order is deliberately preserved, so every locked row still points at
 * the right image. Slot 6 is the one slot whose MEANING changed — it was
 * Offline Mode and is now the guided setup — and it is the single exception to
 * the rule that the six screenshot titles are unchanged.
 *
 * The offline claim is not lost with it: it survives in the hero line, in the
 * Fully Offline feature card, in the third FAQ answer, and in the new slot 6
 * image's own on-screen text.
 */
const screenshots = [
  {
    title: 'Prayer Times',
    description: 'View all 5 daily prayer times with countdown timer and Hijri date.',
  },
  {
    title: 'Qibla Compass',
    description: 'Find the exact direction to Mecca using GPS and your device compass.',
  },
  {
    title: 'Calculation Methods',
    description: 'Choose from 22 calculation methods for your region.',
  },
  {
    title: 'Notifications',
    description: 'Turn notifications on per prayer, Fajr through Isha.',
  },
  {
    title: 'Settings',
    description: 'Full control over calculation methods, Asr timing, and Hijri date adjustment.',
  },
  {
    title: 'Guided Setup',
    description: 'Set up takes about two minutes, and you can run it again any time.',
  },
];

/** The five spec cells. One object, not five tiles — see the CSS. */
const whyCells = [
  { title: 'No Ads', body: 'Zero interruptions during salat.' },
  { title: 'No Data Collection', body: 'Nothing leaves your device.' },
  { title: 'One-Time Purchase', price: '$3.99', body: 'Pay once. No subscriptions.' },
  { title: 'Works Offline', body: 'Calculated on-device, anywhere.' },
  { title: 'Muslim-Built', body: 'By a Muslim developer, for the Ummah.' },
];

/**
 * The hero's entrance beats, in seconds. Six of them, ordered the way the eye
 * arrives: mark, proof, name, category, promise, action.
 */
const HERO_BEATS = {
  tile: 0,
  badge: 0.1,
  title: 0.2,
  kicker: 0.28,
  sub: 0.36,
  cta: 0.46,
} as const;

const enter = (delay: number) => ({ '--enter-delay': `${delay}s` }) as CSSProperties;

export default function NahtadiPage() {
  const project = getProjectById('nahtadi');
  const reviews = getNahtadiReviews();

  if (!project) {
    return <div>Project not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nahtadi',
    operatingSystem: 'iOS',
    applicationCategory: 'LifestyleApplication',
    // Byte-identical to the three metadata descriptions in layout.tsx. The SEO
    // constraint is that the JSON-LD description stays aligned with the page
    // description; they ship together or neither ships.
    description:
      'Accurate Islamic prayer times and Qibla direction for iOS. Zero ads, zero data collection, works offline. One-time purchase, built by a Muslim developer.',
    url: 'https://hendaseh.com/nahtadi',
    image: 'https://hendaseh.com/images/nahtadi/icon.png',
    downloadUrl: project.links.appStore,
    /*
     * Person, not Organization, and the App Store's developer name verbatim.
     *
     * This said `Organization` / `Hendaseh`, which was wrong twice over: it
     * asserted to Google that an organisation authored the app when a person
     * did, and it disagreed with the App Store listing, which names
     * `Omar Saed Younis`. Structured data that contradicts the store page it
     * links to is the kind of mismatch that costs rich-result trust.
     *
     * `Omar Saed Younis` rather than the site's `Omar Younis` is deliberate and
     * is the same call COPY-LOCKED D11 already made for the support page's
     * Developer row: this is the legal name, in one of the few places the legal
     * name belongs, and a user cross-referencing the two needs them to match.
     *
     * Hendaseh is the domain and the mark, not a company. Same defect F1 fixed
     * when it removed "our support team" -- naming an entity that does not
     * exist.
     */
    author: {
      '@type': 'Person',
      name: 'Omar Saed Younis',
      url: 'https://hendaseh.com',
    },
    /*
     * DO NOT DELETE `offers`. It looks like dead weight and is not: Google's
     * SoftwareApplication rich result requires name + `offers` +
     * `aggregateRating` TOGETHER, so removing this block would not merely drop
     * the price from search — it would drop the page out of rich-result
     * eligibility entirely, TAKING THE 5.0 STAR RATING WITH IT. That is a
     * search regression on the one page whose SEO must not regress.
     *
     * The real defect it was once deleted for — markup asserting a price no
     * user could see — is fixed from the other end instead: the amount is
     * visible in the One-Time Purchase card and in the first FAQ answer. A
     * visible price is also self-correcting, where an invisible one can sit
     * wrong indefinitely.
     *
     * `price` and the two visible `$3.99` strings are three renderings of ONE
     * fact and must always agree. Verified against Apple's public lookup API
     * (US storefront) on 2026-08-29.
     */
    offers: {
      '@type': 'Offer',
      price: '3.99',
      priceCurrency: 'USD',
    },
    // Sourced from the single rating block (projects.json appStoreRating) so the
    // badge, reviews section, and structured data all match the live App Store
    // listing. ratingCount = ratings (incl. star-only taps); reviewCount = written reviews.
    ...(project.appStoreRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: project.appStoreRating.value,
        ratingCount: project.appStoreRating.count,
        reviewCount: reviews.length,
      },
    }),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ===== 1. HERO — the green card ===== */}
      <div className="page-wrap nh-hero-region">
        <header className="nh-band nh-band-flagship nh-hero">
          <div className="nh-hero-tile nh-enter" style={enter(HERO_BEATS.tile)}>
            <Image
              src="/images/nahtadi/icon.png"
              alt="Nahtadi App Icon"
              width={128}
              height={128}
              priority
            />
          </div>

          {/* Numbers from the data layer, never hardcoded: one field in
              projects.json feeds this badge, the JSON-LD ratingCount above,
              and nothing else needs editing when it changes. */}
          {project.appStoreRating && (
            <a
              className="nh-badge nh-enter"
              style={enter(HERO_BEATS.badge)}
              href={project.links.appStore ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                {project.appStoreRating.value}★ · {project.appStoreRating.count} ratings on the App
                Store
              </span>
            </a>
          )}

          <h1 className="nh-hero-title nh-enter" style={enter(HERO_BEATS.title)}>
            Nahtadi
          </h1>
          <p className="nh-hero-kicker nh-enter" style={enter(HERO_BEATS.kicker)}>
            Islamic Prayer Times
          </p>
          <p className="nh-hero-sub nh-enter" style={enter(HERO_BEATS.sub)}>
            Accurate prayer times and Qibla direction. No ads. No tracking. Just salat.
          </p>

          <div className="nh-hero-cta nh-enter" style={enter(HERO_BEATS.cta)}>
            <PlatformButtons
              appStoreUrl={project.links.appStore}
              appStoreLive={project.appStoreLive}
            />
          </div>
        </header>
      </div>

      <div id={BODY_ID}>
        {/* ===== 2. APP PREVIEW — directly after the hero, because that is
            where the App Store puts screenshots and for an app the
            screenshots ARE the proof. ===== */}
        <section className="nh-shots">
          <div className="page-wrap">
            <div className="nh-band nh-band-sunken" data-reveal>
              <div className="nh-head">
                <h2 className="section-heading">App Preview</h2>
                <p className="nh-sub">Six screens from the app.</p>
              </div>
              <ScreenshotGallery screenshots={screenshots} />
            </div>
          </div>
        </section>

        {/* ===== 3. REVIEWS ===== */}
        <section className="nh-reviews">
          <div className="page-wrap">
            <div className="nh-band nh-band-raised" data-reveal>
              <ReviewsCarousel reviews={reviews} />
            </div>
          </div>
        </section>

        {/* ===== 4. WHY NAHTADI? — uncontained, on the page ground ===== */}
        <section className="page-wrap nh-why">
          <div className="nh-head" data-reveal>
            <h2 className="section-heading">Why Nahtadi?</h2>
            <p className="nh-sub">
              Most prayer apps are free because <em>you</em> are the product. Nahtadi isn&rsquo;t.
            </p>
          </div>
          <div className="nh-why-card" data-reveal>
            {whyCells.map((cell) => (
              <div className="nh-why-cell" key={cell.title}>
                <h3>{cell.title}</h3>
                {/* The price is set as DATA — a value line above its own label
                    — rather than woven into prose, so making it visible costs
                    no locked string. */}
                {cell.price && <span className="nh-why-price">{cell.price}</span>}
                <p>{cell.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. EVERYTHING YOU NEED FOR SALAT — same ground as section 4,
            and uncontained for the same reason. The two are one argument (why
            the app exists, then what it does) and proximity is how that gets
            said. ===== */}
        <section className="page-wrap nh-features">
          <div className="nh-head" data-reveal>
            <h2 className="section-heading">Everything You Need for Salat</h2>
            <p className="nh-sub">
              Prayer times, Qibla, Hijri dates, and notifications. All of it on your device.
            </p>
          </div>
          <div className="nh-fgrid">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                // Staggered across each row of four rather than across all
                // eight: a delay that kept climbing would leave the last tile
                // arriving long after the eye had already reached it.
                revealDelay={(index % 4) * 0.05}
              />
            ))}
          </div>
        </section>

        {/* ===== 6. FAQ ===== */}
        <section className="nh-faq">
          <div className="page-wrap">
            <div className="nh-band nh-band-raised" data-reveal>
              <div className="nh-head">
                <h2 className="section-heading">Frequently Asked Questions</h2>
              </div>
              <div className="nh-faq-list">
                {faqs.map((faq, index) => (
                  // The first row ships open: it is the pricing question, it is
                  // the objection a visitor arrives with, and an all-closed
                  // list reads as a wall of chevrons.
                  <details className="nh-q" key={faq.q} open={index === 0}>
                    <summary>
                      {faq.q}
                      <span className="nh-q-mark">
                        <PlusMark />
                      </span>
                    </summary>
                    <p className="nh-q-body">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 7. PRIVACY — the closing green band ===== */}
        <section className="page-wrap nh-privacy">
          <div className="nh-band nh-band-flagship nh-priv-card" data-reveal>
            <div className="nh-priv-head">
              {/* The page's ONE eyebrow. Four of the five section headings are
                  already labels naming their own section, and an eyebrow
                  identical to its heading is forbidden; exactly one heading is
                  a STATEMENT that does not name its topic, which is the case
                  this pattern exists for. */}
              <span className="section-eyebrow">PRIVACY</span>
              <h2 className="section-heading">Nothing leaves your device.</h2>
              <p className="nh-sub">
                Nahtadi collects nothing and transmits nothing. No servers, no accounts.
              </p>
            </div>

            {/* THE CARD IS THE LINK and the pill inside it is a <span> — never
                a nested <a> or <button>. Each card has ONE action, which is
                Contact's case; the Projects contract's "actions are explicit
                pills" rule governs cards with TWO, where one link cannot
                express both. These are also the links the App Store requires
                to be reachable, so the whole 401x242 card is the target. */}
            <div className="nh-priv-grid">
              <Link className="nh-priv-tile" href="/nahtadi/privacy">
                <div className="nh-ico">
                  <ShieldIcon />
                </div>
                <h3>Privacy Policy</h3>
                <p>What Nahtadi stores, what it never sends, and how to revoke location access.</p>
                <span className="nh-go">
                  <AffordanceLabel label="Read Privacy Policy" glyph={<ChevronRight />} />
                </span>
              </Link>

              <Link className="nh-priv-tile" href="/nahtadi/support">
                <div className="nh-ico">
                  <HelpIcon />
                </div>
                <h3>App Support</h3>
                <p>Setup, calculation methods, notifications, and how to reach me.</p>
                <span className="nh-go">
                  <AffordanceLabel label="Get Support" glyph={<ChevronRight />} />
                </span>
              </Link>
            </div>

            <div className="nh-priv-foot">
              <p>Questions or feedback?</p>
              <a href="mailto:support@hendaseh.com?subject=Nahtadi App Inquiry">
                support@hendaseh.com
              </a>
            </div>
          </div>
        </section>
      </div>

      <ScrollReveal rootId={BODY_ID} />
    </>
  );
}
