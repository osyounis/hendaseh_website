import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Nahtadi - Islamic Prayer Times App for iOS',
    template: '%s | Nahtadi',
  },
  description:
    'Accurate Islamic prayer times and Qibla direction for iPhone and iPad. Built with Swift and SwiftUI. Fully offline, privacy-first design. Calculate all 5 daily prayers with multiple calculation methods.',
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
    title: 'Nahtadi - Islamic Prayer Times',
    description: 'Accurate prayer times and Qibla direction for iPhone and iPad',
    url: 'https://hendaseh.com/nahtadi',
    siteName: 'Nahtadi',
    images: [
      {
        url: '/images/nahtadi/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nahtadi - Islamic Prayer Times App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nahtadi - Islamic Prayer Times',
    description: 'Accurate prayer times and Qibla direction for iPhone and iPad',
    images: ['/images/nahtadi/og-image.png'],
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
