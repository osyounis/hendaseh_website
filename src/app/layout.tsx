import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
    images: [{ url: '/api/og?card=site', width: 1200, height: 630, alt: 'Omar Younis — Software Engineer · iOS & Machine Learning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Younis | Software Engineer — iOS & ML',
    description: 'Software engineer and problem-solver — iOS (Swift/SwiftUI), machine learning, data engineering, and scientific computing.',
    images: ['/api/og?card=site'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoMedium.variable} ${robotoRegular.variable} antialiased`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Omar Younis. All rights reserved.</p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
