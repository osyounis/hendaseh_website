import type { Metadata } from 'next';

export const metadata: Metadata = {
  // `absolute`, not `default`: the root layout carries a `%s - Omar Younis`
  // title template, and a `default` here would be augmented by it -- appending
  // ` - Omar Younis` to a FROZEN title the App Store links to. `absolute`
  // ignores the parent template, so this renders byte-identical to before,
  // while `template` below still applies to /nahtadi/privacy and /support.
  title: {
    absolute: 'Nahtadi — Islamic Prayer Times. No Ads. No Tracking.',
    template: '%s | Nahtadi',
  },
  description:
    'Nahtadi — Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.',
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
    title: 'Nahtadi — Islamic Prayer Times. No Ads. No Tracking.',
    description:
      'Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.',
    url: 'https://hendaseh.com/nahtadi',
    siteName: 'Nahtadi',
    images: [
      {
        url: '/og/nahtadi.png',
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
    title: 'Nahtadi — Islamic Prayer Times. No Ads. No Tracking.',
    description:
      'Accurate prayer times with zero ads and zero data collection. One-time purchase. Works offline.',
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
