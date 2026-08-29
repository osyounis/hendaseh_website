import type { Metadata } from 'next';

/**
 * ONE description string, written byte-identical into FOUR slots: the three
 * here and `jsonLd.description` in `page.tsx`. That is the no-drift pattern
 * the sitewide title/description pass applied to the other four pages, and it
 * replaces three different variants that had already drifted apart (142 / 132
 * / 95 characters). 153 characters, under the 160 ceiling.
 *
 * What it buys: `Qibla` and `iOS` were in the `keywords` array but absent from
 * every description on the page. They are now in all four.
 *
 * The JSON-LD copy is in a different FILE but is not independent — the SEO
 * constraint is that the two stay aligned, so they ship together or neither
 * ships. Do not edit one without the other.
 */
const DESCRIPTION =
  'Accurate Islamic prayer times and Qibla direction for iOS. Zero ads, zero data collection, works offline. One-time purchase, built by a Muslim developer.';

/** The frozen contract on this page is the URL, not the title text. The
 *  separator is U+002D HYPHEN-MINUS, matching the ` - ` the sitewide pass
 *  standardised; the change is one character per copy and keyword-identical. */
const TITLE = 'Nahtadi - Islamic Prayer Times. No Ads. No Tracking.';

/** Unified with the same alt on /nahtadi/privacy and /nahtadi/support, which
 *  point at the same card. All three now read identically. */
const OG_ALT = 'Nahtadi - Islamic Prayer Times';

export const metadata: Metadata = {
  // `absolute`, not `default`: the root layout carries a `%s - Omar Younis`
  // title template, and a `default` here would be augmented by it -- appending
  // ` - Omar Younis` to a FROZEN title the App Store links to. `absolute`
  // ignores the parent template, so this renders byte-identical to before,
  // while `template` below still applies to /nahtadi/privacy and /support.
  title: {
    absolute: TITLE,
    // `Nahtadi` stays in the site slot rather than converging on `Omar Younis`:
    // `siteName: 'Nahtadi'` is already set on all three pages, and a visitor
    // arriving from the App Store's privacy-policy link came for the product,
    // not the portfolio. Only the separator converges.
    template: '%s - Nahtadi',
  },
  description: DESCRIPTION,
  keywords: [
    'Islamic prayer times',
    'Muslim prayer app',
    'Qibla direction',
    'Salat times',
    'iOS app',
    'Swift',
    'SwiftUI',
    'Prayer times calculator',
    'Hijri calendar',
    'Nahtadi',
    'Prayer notifications',
    'Offline prayer times',
    'Islamic app',
    'Fajr Dhuhr Asr Maghrib Isha',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://hendaseh.com/nahtadi',
    siteName: 'Nahtadi',
    images: [
      {
        url: '/og/nahtadi.png',
        width: 1200,
        height: 630,
        alt: OG_ALT,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og/nahtadi.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://hendaseh.com/nahtadi',
  },
};

export default function NahtadiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
