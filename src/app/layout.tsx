import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';

// Primary font: Roboto Medium (weight 500)
const robotoMedium = Roboto({
  weight: '500',
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

export const metadata: Metadata = {
  metadataBase: new URL('https://hendaseh.com'),
  title: 'Omar Younis | Software Engineer — iOS & ML',
  description: 'Omar Younis — software engineer and problem-solver. Ships iOS apps in Swift/SwiftUI, with machine-learning, data-engineering, and scientific-computing range, plus seven years in mechanical engineering. M.S. Computer Science, CSUF (May 2026).',
  keywords: ['Omar Younis', 'Software Engineer', 'iOS', 'Swift', 'SwiftUI', 'Machine Learning', 'Data Engineering', 'Python', 'PyTorch', 'AWS', 'CUDA'],
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
    title: 'Omar Younis | Software Engineer — iOS & ML',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and scientific computing.',
    url: 'https://hendaseh.com',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis — Software Engineer · iOS & Machine Learning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Younis | Software Engineer — iOS & ML',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and scientific computing.',
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
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Omar Younis. All rights reserved.</p>
          </div>
        </footer>
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
