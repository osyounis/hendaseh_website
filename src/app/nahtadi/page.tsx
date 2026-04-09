import type { Metadata } from 'next';
import { getProjectById } from '@/lib/projects';
import FeatureCard from '@/components/nahtadi/FeatureCard';
import PlatformButtons from '@/components/nahtadi/PlatformButtons';
import ScreenshotGallery from '@/components/nahtadi/ScreenshotGallery';
import {
  HiClock,
  HiLocationMarker,
  HiCalendar,
  HiBell,
  HiWifi,
  HiGlobeAlt,
  HiStar,
} from 'react-icons/hi';
import { FaCompass, FaCog, FaShieldAlt, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Nahtadi — Islamic Prayer Times. No Ads. No Tracking.',
  description:
    'Nahtadi — Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.',
  keywords: [
    'Islamic prayer times',
    'prayer times app',
    'Qibla direction',
    'Muslim app',
    'Salat times',
    'Hijri calendar',
    'no ads prayer app',
    'private prayer app',
    'offline prayer times',
    'Nahtadi',
  ],
  alternates: { canonical: 'https://hendaseh.com/nahtadi' },
  openGraph: {
    title: 'Nahtadi — Islamic Prayer Times. No Ads. No Tracking.',
    description:
      'Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.',
    url: 'https://hendaseh.com/nahtadi',
    siteName: 'Nahtadi',
    images: [
      {
        url: '/images/nahtadi/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nahtadi — Islamic Prayer Times',
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
    images: ['/images/nahtadi/og-image.jpg'],
  },
};

const faqs = [
  {
    q: "Why isn't it free?",
    a: "Many prayer apps are \"free\" because they make money from ads and your data. Nahtadi is a one-time purchase because we believe your worship shouldn't be monetized. No ads means no incentive to track you. One payment means we don't nag you with subscription prompts during salat.",
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Nahtadi collects zero personal data. Everything — your location, settings, and preferences — stays on your device. There are no analytics, no third-party trackers, and no accounts to create.',
  },
  {
    q: 'Does it work without internet?',
    a: 'Completely. Prayer times are calculated on-device using astronomical algorithms, so Nahtadi works offline anywhere in the world once installed.',
  },
  {
    q: 'Which calculation methods are supported?',
    a: 'Nahtadi supports all major calculation methods including ISNA (North America), Muslim World League (MWL), Umm al-Qura (UQU, Saudi Arabia), Egyptian General Authority (EGAS), and more — with high-latitude adjustments for extreme latitudes.',
  },
];

export default function NahtadiPage() {
  const project = getProjectById('nahtadi');

  if (!project) {
    return <div>Project not found</div>;
  }

  const features = [
    {
      icon: <HiClock />,
      title: '5 Daily Prayer Times',
      description:
        'Accurate calculations for Fajr, Dhuhr, Asr, Maghrib, and Isha using astronomical algorithms.',
    },
    {
      icon: <FaCompass />,
      title: 'Qibla Direction',
      description:
        'Find the precise direction to Mecca from anywhere in the world with compass integration.',
    },
    {
      icon: <HiCalendar />,
      title: 'Hijri Calendar',
      description:
        'Seamlessly convert between Hijri and Gregorian calendars with a built-in converter.',
    },
    {
      icon: <HiBell />,
      title: 'Prayer Notifications',
      description:
        'Customizable reminders for each prayer time so you never miss Salat.',
    },
    {
      icon: <HiWifi />,
      title: 'Fully Offline',
      description:
        'Works completely offline once installed. No internet connection required.',
    },
    {
      icon: <HiGlobeAlt />,
      title: 'Works Worldwide',
      description:
        'Supports all locations globally with high-latitude adjustments for extreme latitudes.',
    },
    {
      icon: <FaCog />,
      title: 'Multiple Calculation Methods',
      description:
        'ISNA, MWL, UQU, EGAS, and more — pick the method for your region.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Privacy First',
      description:
        'All data stored locally on your device. No tracking, no data collection, ever.',
    },
  ];

  const screenshots = [
    {
      icon: <HiClock />,
      title: 'Prayer Times',
      description:
        'View all 5 daily prayer times with customizable calculation methods and Hijri date.',
    },
    {
      icon: <FaCompass />,
      title: 'Qibla Compass',
      description:
        'Find the exact direction to Mecca using GPS and your device compass.',
    },
    {
      icon: <FaCog />,
      title: 'Settings & Methods',
      description:
        'Choose from multiple calculation methods and customize app preferences.',
    },
    {
      icon: <HiCalendar />,
      title: 'Hijri Calendar',
      description:
        'Convert between Hijri and Gregorian calendars with automatic updates.',
    },
    {
      icon: <HiBell />,
      title: 'Prayer Notifications',
      description:
        'Set up customizable notifications for each prayer time and Adhan.',
    },
    {
      icon: <HiLocationMarker />,
      title: 'Location Services',
      description:
        'Automatic location detection or manual entry for accurate prayer times.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nahtadi',
    operatingSystem: 'iOS',
    applicationCategory: 'LifestyleApplication',
    description:
      'Accurate Islamic prayer times with zero ads and zero data collection. One-time purchase. Works offline. Built by a Muslim developer.',
    url: 'https://hendaseh.com/nahtadi',
    image: 'https://hendaseh.com/images/nahtadi/icon.png',
    downloadUrl: project.appStoreUrl,
    author: {
      '@type': 'Organization',
      name: 'Hendaseh',
      url: 'https://hendaseh.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '4',
      bestRating: '5',
    },
    offers: {
      '@type': 'Offer',
      price: '3.99',
      priceCurrency: 'USD',
    },
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
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-300 to-blue-500 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* App Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl overflow-hidden">
              <Image
                src="/images/nahtadi/icon.png"
                alt="Nahtadi App Icon"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Ratings Badge */}
          <div className="mb-6 flex justify-center">
            <a
              href={project.appStoreUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40 hover:bg-white/25 transition-colors"
            >
              <HiStar className="text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                5.0★ · 4 Ratings on the App Store
              </span>
            </a>
          </div>

          {/* App Name & Tagline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Nahtadi
          </h1>
          <p className="text-xl sm:text-2xl text-blue-50 mb-3">
            Islamic Prayer Times
          </p>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Accurate prayer times and Qibla direction. No ads. No tracking. Just salat.
          </p>

          {/* Download Buttons — iOS only */}
          <div className="mb-2">
            <PlatformButtons
              appStoreUrl={project.appStoreUrl}
              googlePlayUrl={null}
              appStoreLive={project.appStoreLive}
              googlePlayLive={false}
              showBothPlatforms={false}
            />
          </div>
        </div>
      </section>

      {/* Review Quote */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-3 text-yellow-400 text-xl">
            <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
          </div>
          <blockquote className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
            &ldquo;Most accurate prayer times app I have found.&rdquo;
          </blockquote>
          <p className="mt-4 text-gray-500 text-sm">
            — DinaYasin, App Store review
          </p>
        </div>
      </section>

      {/* Why Nahtadi? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Nahtadi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most prayer apps are free because <em>you</em> are the product. Nahtadi isn&apos;t.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: 'No Ads', desc: 'Zero interruptions during salat.' },
              { title: 'No Data Collection', desc: 'Nothing leaves your device.' },
              { title: 'One-Time Purchase', desc: 'Pay once. No subscriptions.' },
              { title: 'Works Offline', desc: 'Calculated on-device, anywhere.' },
              { title: 'Muslim-Built', desc: 'By a Muslim developer, for the Ummah.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-blue-300 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Salat
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nahtadi provides comprehensive tools for Muslims to stay connected to their daily prayers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              App Preview
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-3">
              Take a look at Nahtadi&apos;s beautiful and intuitive interface
            </p>
            <p className="text-sm text-gray-500">Scroll to see more →</p>
          </div>

          <ScreenshotGallery screenshots={screenshots} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition"
              >
                <summary className="cursor-pointer font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-500 text-2xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Stay in the Loop — Email signup + Instagram */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get notified about new features, updates, and the Android release.
          </p>

          <form
            action="mailto:support@hendaseh.com?subject=Nahtadi%20Updates%20Signup"
            method="post"
            encType="text/plain"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-[#0093FF] hover:bg-[#0075CC] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Notify Me
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-gray-700">
            <FaInstagram className="text-pink-500 text-xl" />
            <span>Follow updates on Instagram:</span>
            <a
              href="https://instagram.com/Hendaseh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              @Hendaseh
            </a>
          </div>
        </div>
      </section>

      {/* Privacy & Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nahtadi is designed with privacy-first principles. Your data stays on your device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/nahtadi/privacy"
              className="bg-white border border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <FaShieldAlt className="text-[#0093FF] text-3xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Privacy Policy
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how Nahtadi protects your privacy with no data collection.
              </p>
              <span className="text-blue-600 font-medium hover:underline">
                Read Privacy Policy →
              </span>
            </Link>

            <Link
              href="/nahtadi/support"
              className="bg-white border border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <HiBell className="text-[#0093FF] text-3xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">App Support</h3>
              <p className="text-gray-600 mb-4">
                Have questions? Check our FAQ or contact our support team.
              </p>
              <span className="text-blue-600 font-medium hover:underline">
                Get Support →
              </span>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Questions or feedback?</p>
            <a
              href="mailto:support@hendaseh.com?subject=Nahtadi App Inquiry"
              className="text-blue-600 hover:text-blue-800 font-medium text-lg"
            >
              support@hendaseh.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
