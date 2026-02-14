import type { Metadata } from 'next';
import { HiMail } from 'react-icons/hi';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'App Support',
  description: 'Support and frequently asked questions for Nahtadi - Islamic Prayer Times app for iOS and Android.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SupportPage() {
  const faqs = [
    {
      question: 'How do I change the prayer calculation method?',
      answer:
        'Open the app and tap on the Settings tab (gear icon) at the bottom of the screen. Under "Calculation Method," you\'ll see an "Automatic Selection" toggle. When enabled, the app automatically detects your country and selects the appropriate calculation method. You can disable this to manually choose from various methods including ISNA (Islamic Society of North America), MWL (Muslim World League), UQU (Umm al-Qura University), EGAS (Egyptian General Authority of Survey), and others. You can also select your preferred Asr calculation method (Standard or Hanafi).',
    },
    {
      question: 'The prayer times seem incorrect. What should I check?',
      answer: (
        <>
          First, verify that Location Services are enabled for Nahtadi in your device settings (iOS: Settings → Nahtadi → Location; Android: Settings → Apps → Nahtadi → Permissions → Location). Then, check that you've selected the appropriate calculation method for your region. The app defaults to Automatic Selection, which chooses the method based on your detected country. Different Islamic authorities use different calculation methods, so you can manually select the one recommended for your area by disabling Automatic Selection in the Settings tab. If the times are still incorrect after trying these steps, please contact{' '}
          <a
            href="mailto:support@hendaseh.com?subject=Nahtadi Prayer Times Issue&body=Date:%0D%0ALocation (city, state, country):%0D%0ATimezone:%0D%0AWhat the prayer times should be for the provided date:%0D%0A"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            support@hendaseh.com
          </a>{' '}
          with the following information: the date, your location (city, state, country), your timezone, and what the prayer times should be for that date.
        </>
      ),
    },
    {
      question: 'How do I enable prayer time notifications?',
      answer:
        'Go to the Settings tab (gear icon) at the bottom of the screen. Under "Prayer Notifications," first enable the master "Enable Notifications" toggle. Then, you can individually enable or disable notifications for each prayer time (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha). The app will request notification permission if not already granted. Once enabled, notifications are automatically scheduled for the next 10 days. On day 9, you\'ll receive a reminder notification asking you to open the app so it can automatically schedule the next batch of notifications.',
    },
    {
      question: 'Does Nahtadi require an internet connection?',
      answer:
        'No, Nahtadi works completely offline once installed. All calculations are performed locally on your device using astronomical algorithms. The app does not require internet access for any functionality.',
    },
    {
      question: 'How does Nahtadi calculate the Qibla direction?',
      answer:
        'Nahtadi uses your device\'s GPS location and applies spherical trigonometry to calculate the precise direction to the Kaaba in Mecca. The compass feature uses your device\'s magnetometer to show the Qibla direction relative to your current orientation. You can access the Qibla compass by tapping the Qibla tab (compass icon) at the bottom of the screen.',
    },
    {
      question: 'Can I use Nahtadi anywhere in the world?',
      answer:
        'Yes! Nahtadi works worldwide. The app supports high-latitude adjustments for locations at ±48.5 degrees latitude (both north and south of the equator) where traditional calculation methods may not work during certain seasons. It also includes multiple calculation methods suitable for different regions, with automatic selection based on your detected country.',
    },
    {
      question: 'Is my data private?',
      answer: (
        <>
          Absolutely. Nahtadi does not collect, transmit, or share any personal information. All your data (location, settings, preferences) is stored locally on your device using platform-native secure storage (SwiftData on iOS, Room on Android). See our{' '}
          <Link
            href="/nahtadi/privacy"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Privacy Policy
          </Link>{' '}
          for complete details.
        </>
      ),
    },
    {
      question: 'How do I view Hijri and Gregorian dates?',
      answer:
        'Both the Hijri and Gregorian dates are automatically displayed at the top of the Prayer Times screen (home tab). You don\'t need to navigate anywhere special - they\'re always visible. If you need to adjust the Hijri date (for example, if your local community follows a different moon sighting), you can use the Hijri Date Adjustment option in the Settings tab to shift it by ±3 days.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header + FAQ Section Combined */}
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Nahtadi App Support
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Support
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Have a question or issue not covered in the FAQ? We're here to help!
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <HiMail className="text-[#0093FF] text-2xl mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email Support
                </h3>
                <p className="text-gray-700 mb-3">
                  Send us an email and we'll get back to you within 24-48 hours.
                </p>
                <a
                  href="mailto:support@hendaseh.com?subject=Nahtadi App Support"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  support@hendaseh.com
                </a>
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Technical Information
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-700">App Version</dt>
                <dd className="text-gray-600">v1.0.0</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Platforms</dt>
                <dd className="text-gray-600">iOS & Android</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Requirements</dt>
                <dd className="text-gray-600">iOS 17.0+ | Android 8.0+ (API 26+)</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Developer</dt>
                <dd className="text-gray-600">Omar Saed Younis</dd>
              </div>
            </dl>
          </div>

          {/* Privacy Link */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Concerned about privacy?{' '}
              <a
                href="/nahtadi/privacy"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Read our Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Back to App Page */}
        <div className="mt-8 text-center">
          <a
            href="/nahtadi"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            ← Back to Nahtadi App Page
          </a>
        </div>
      </div>
    </div>
  );
}
