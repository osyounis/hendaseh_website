import { getProjectById } from '@/lib/projects';
import FeatureCard from '@/components/nahtadi/FeatureCard';
import ScreenshotPlaceholder from '@/components/nahtadi/ScreenshotPlaceholder';
import AppStoreButton from '@/components/nahtadi/AppStoreButton';
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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4 sm:px-6 lg:px-8">
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

          {/* Download Button */}
          <div className="mb-6">
            <AppStoreButton
              appStoreUrl={project.appStoreUrl}
              appStoreLive={project.appStoreLive}
            />
          </div>

          {/* Version Badge */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
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

          {/* Horizontal Scrolling Container */}
          <div className="overflow-x-auto overflow-y-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-6 sm:gap-8 lg:gap-10" style={{ scrollSnapType: 'x mandatory' }}>
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[220px] sm:w-[240px] lg:w-[260px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Screenshot - iPhone 17 Pro Style */}
                  <div className="relative aspect-[9/19.5] mb-4 rounded-[2.75rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
                    <Image
                      src={`/images/nahtadi/screenshot-${index + 1}.png`}
                      alt={screenshot.title}
                      fill
                      className="object-contain bg-white"
                      sizes="260px"
                    />
                  </div>

                  {/* Screenshot Info - Enhanced */}
                  <div className="text-center px-3 bg-white rounded-xl py-4 shadow-md border border-gray-200 min-h-[120px] flex flex-col justify-center">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {screenshot.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {screenshot.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {screenshots.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-blue-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built with Modern iOS Technologies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Engineered for performance, privacy, and offline reliability
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Tech Stack */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMobileAlt className="text-blue-600 mr-3" />
                  Technology Stack
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {project.technologies.map((tech, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Privacy & Architecture */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaShieldAlt className="text-blue-600 mr-3" />
                  Privacy & Design
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    All data stored locally (SwiftData)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    No internet required
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Zero data collection
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Native iOS performance
                  </li>
                </ul>
              </div>
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
              <FaShieldAlt className="text-blue-600 text-3xl mb-4" />
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
              <HiBell className="text-blue-600 text-3xl mb-4" />
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
              Nahtadi demonstrates expertise in iOS development, astronomical algorithms, and
              user-centric design. Built with Swift and SwiftUI, this app showcases modern iOS
              development practices including offline-first architecture, local data persistence
              with SwiftData, and privacy-focused engineering.
            </p>
            <Link
              href="/projects"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
            >
              View More Projects →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
