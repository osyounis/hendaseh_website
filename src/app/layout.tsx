import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Omar Younis | Software Engineer',
  description: 'Software Engineer specializing in data engineering, machine learning, and scientific computing. Currently at Qualcomm. MS in Computer Science student.',
  keywords: ['Omar Younis', 'Software Engineer', 'Data Engineering', 'Machine Learning', 'Python', 'AWS', 'PyTorch', 'Qualcomm'],
  authors: [{ name: 'Omar Younis' }],
  openGraph: {
    title: 'Omar Younis | Software Engineer',
    description: 'Software Engineer specializing in data engineering, machine learning, and scientific computing',
    url: 'https://hendaseh.com',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
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
