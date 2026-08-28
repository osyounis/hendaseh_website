import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/Footer';

// Primary font. Weight 500 is the brandbook's heading weight; 700 and 900 are
// loaded because the redesign's statement headings are set in Roboto 900 and a
// synthesised bold is visibly wrong at display sizes.
const robotoMedium = Roboto({
  weight: ['500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto-medium',
  display: 'swap',
});

// Secondary font: Roboto Regular (weight 400)
const robotoRegular = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto-regular',
  display: 'swap',
});

/** One description string per surface, reused for `description`, `og:` and
 *  `twitter:` so the three cannot drift apart (they already had). 160 chars is
 *  the ceiling; social previews cut around 125, so the point comes first. */
const SITE_DESCRIPTION =
  'Omar Younis is a software engineer and problem-solver: shipped iOS apps in Swift and SwiftUI, machine learning, and autonomous systems work.';

/** Alt text for the shared site OG card, which renders the name over the
 *  locked surface string. Every page pointing at `/og/site.png` uses this. */
const OG_ALT = 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems';

/**
 * TITLE STRUCTURE (Task B5). The site-name slot is `Omar Younis`, not
 * `Hendaseh`: Hendaseh is the domain and the mark, not what anyone searches,
 * and the domain already renders under the title in a result. So it is dropped
 * from title TEXT and lives on in the `siteName`/`og:site_name` slot only.
 *
 * `template` puts the suffix in ONE place, so it cannot drift across five
 * files the way the old hand-written suffix did. Sub-pages set a bare
 * `title: 'About'` and resolve to `About - Omar Younis`.
 *
 * ONE separator sitewide: a plain hyphen-minus (U+002D) with spaces, the
 * Apple/YouTube shape (`Apple Fitness+ - Apple`). Not an en dash, not an em
 * dash, not a middot -- an en dash is near-identical in a diff and would break
 * every match silently. `·` now appears ONLY inside the locked surface
 * string, never as a title separator.
 *
 * Next only applies `template` to CHILD segments, so `app/page.tsx` -- the same
 * segment as this layout -- never receives it. That is why the homepage title
 * is `default` here and `app/page.tsx` sets no `title` at all: the homepage
 * keeps the full tagline (a bare name tells a recruiter nothing, and Apple's
 * one-word homepage title rides on brand recognition this site does not have).
 * `app/nahtadi/layout.tsx` opts out with `title.absolute` so its frozen titles
 * render byte-identical to before.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://hendaseh.com'),
  title: {
    default: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems',
    template: '%s - Omar Younis',
  },
  description: SITE_DESCRIPTION,
  keywords: ['Omar Younis', 'Software Engineer', 'iOS', 'Swift', 'SwiftUI', 'Machine Learning', 'Autonomous Systems', 'Data Engineering', 'Python', 'PyTorch', 'AWS', 'CUDA'],
  authors: [{ name: 'Omar Younis' }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems',
    description: SITE_DESCRIPTION,
    url: 'https://hendaseh.com',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Younis - Software Engineer · iOS, ML & Autonomous Systems',
    description: SITE_DESCRIPTION,
    images: ['/og/site.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next/font variable classes live on <html> so the `--font-roboto-*` vars are
    // defined on the same element as the `@theme` `:root` declarations that
    // reference them (`--font-heading` / `--font-body`). On <body> they resolved
    // to the guaranteed-invalid value and both tokens computed to nothing.
    <html lang="en" className={`${robotoMedium.variable} ${robotoRegular.variable}`}>
      <body className="antialiased">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/*
          Cloudflare Web Analytics (cookieless). Installed as a snippet rather
          than by Cloudflare's automatic injection: auto-injection rewrites HTML
          passing through the proxy and does not reach Worker responses, so the
          beacon never appeared on this site. Verified empirically before
          switching to manual installation.

          Deliberately NO integrity/SRI hash. The beacon is a self-updating
          script served from Cloudflare's own edge — the same infrastructure
          already serving this site — so a pinned hash would silently kill
          analytics on their next release with no failure signal.

          The token is not a secret; it ships in the HTML of every site using
          Web Analytics.

          `defer` is redundant beside `type="module"` (module scripts are
          deferred by spec) but is kept so @next/next/no-sync-scripts can see
          the script is non-blocking, rather than disabling that rule here.
        */}
        <script
          type="module"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9cf964f6a3c44480b01ac78088fce540"}'
        />
      </body>
    </html>
  );
}
