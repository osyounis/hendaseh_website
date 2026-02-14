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
} from 'react-icons/hi';
import { FaCompass, FaMoon, FaSun, FaCog, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Nahtadi - Islamic Prayer Times for iOS & Android | Omar Younis',
  description: 'Nahtadi: Native mobile app for iOS and Android calculating Islamic prayer times and Qibla direction. iOS built with Swift and SwiftUI, Android built with Kotlin and Jetpack Compose. Available on App Store & Google Play.',
  keywords: ['Islamic prayer times', 'prayer times app', 'Qibla direction', 'iOS app', 'Android app', 'Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'Muslim app', 'Salat times', 'Hijri calendar', 'prayer notifications', 'native mobile development'],
  openGraph: {
    title: 'Nahtadi - Islamic Prayer Times for iOS & Android',
    description: 'Accurate prayer times and Qibla direction, always at hand. Native apps built with Swift/SwiftUI (iOS) and Kotlin/Jetpack Compose (Android).',
    url: 'https://hendaseh.com/nahtadi',
    siteName: 'Hendaseh',
    images: [
      {
        url: '/images/nahtadi/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nahtadi - Islamic Prayer Times for iOS and Android',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nahtadi - Islamic Prayer Times for iOS & Android',
    description: 'Accurate prayer times and Qibla direction. Native iOS (Swift/SwiftUI) and Android (Kotlin/Jetpack Compose) apps.',
    images: ['/images/nahtadi/og-image.jpg'],
  },
};

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
        'Seamlessly convert between Hijri and Gregorian calendars with built-in converter.',
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
        'Choose from ISNA, MWL, UQU, EGAS, and more. Select the method for your region.',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-300 to-blue-500 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* App Icon */}
          <div className="mb-8 flex justify-center">
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

          {/* App Name & Tagline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Nahtadi
          </h1>
          <p className="text-xl sm:text-2xl text-blue-50 mb-3">
            Islamic Prayer Times
          </p>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Accurate prayer times and Qibla direction, always at hand
          </p>

          {/* Download Buttons */}
          <div className="mb-6">
            <PlatformButtons
              appStoreUrl={project.appStoreUrl}
              googlePlayUrl={project.googlePlayUrl}
              appStoreLive={project.appStoreLive}
              googlePlayLive={project.googlePlayLive}
              showBothPlatforms={true}
            />
          </div>

          {/* Version Badge */}
          <div className="inline-block bg-[#0A1A2F]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <span className="text-sm font-medium text-white">{project.stats}</span>
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

      {/* Screenshots Gallery - Horizontal Scrolling */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              App Preview
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-3">
              Take a look at Nahtadi's beautiful and intuitive interface
            </p>
            <p className="text-sm text-gray-500">
              Scroll to see more →
            </p>
          </div>

          <ScreenshotGallery screenshots={screenshots} />
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built with Native Platform Technologies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform-native implementations engineered for performance, privacy, and offline reliability
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* iOS Tech Stack */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMobileAlt className="text-[#0093FF] mr-3" />
                  iOS Technology Stack
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                    Swift
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                    SwiftUI
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                    SwiftData (local storage)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                    iOS 17.0+
                  </li>
                </ul>
              </div>

              {/* Android Tech Stack */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMobileAlt className="text-[#34A853] mr-3" />
                  Android Technology Stack
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#34A853] rounded-full mr-3"></span>
                    Kotlin
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#34A853] rounded-full mr-3"></span>
                    Jetpack Compose
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#34A853] rounded-full mr-3"></span>
                    Room (local storage)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#34A853] rounded-full mr-3"></span>
                    Android 8.0+ (API 26+)
                  </li>
                </ul>
              </div>
            </div>

            {/* Shared Architecture */}
            <div className="pt-8 border-t border-blue-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaShieldAlt className="text-[#0093FF] mr-3" />
                Privacy-First Architecture (Both Platforms)
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                  All data stored locally on device
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                  No internet required
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                  Zero data collection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#0093FF] rounded-full mr-3"></span>
                  Native platform performance
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="pt-8 border-t border-blue-200">
              <p className="text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
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
            {/* Privacy Policy Card */}
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

            {/* Support Card */}
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

          {/* Contact Email */}
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

      {/* Developer Context (For Employers) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              About This Project
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Nahtadi demonstrates expertise in native mobile development, astronomical algorithms, and
              user-centric design. The iOS version is built with Swift and SwiftUI, showcasing modern iOS
              development practices including offline-first architecture, local data persistence
              with SwiftData, and privacy-focused engineering. The Android version leverages Kotlin and
              Jetpack Compose for a consistent native experience. Both implementations emphasize
              platform-specific best practices while maintaining feature parity.
            </p>
            <Link
              href="/projects"
              className="inline-block bg-[#0093FF] hover:bg-[#0075CC] text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
            >
              View More Projects →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
