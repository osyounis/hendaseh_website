import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Nahtadi iOS app. No data collection, fully offline.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 2, 2026';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Privacy Policy for Nahtadi
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nahtadi is committed to protecting your privacy. This app is designed with
              privacy-first principles and does not collect, transmit, or share any personal
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Collection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Nahtadi does NOT collect, transmit, or share any personal information.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed">
              The app operates entirely offline and does not communicate with any external servers
              or third-party services. No user data is ever sent from your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All data is stored locally on your device using Apple's SwiftData framework. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Prayer time calculations and settings</li>
              <li>Your preferred calculation method</li>
              <li>Location data (never transmitted off your device)</li>
              <li>User preferences and customization settings</li>
              <li>Prayer time notification preferences</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              This data remains on your device and is never accessed by the developer or any third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nahtadi uses location data exclusively for calculating accurate prayer times for your
              current location. This location information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Is used ONLY for prayer time calculations on your device</li>
              <li>Is NEVER transmitted to external servers or services</li>
              <li>Is stored locally using Apple's secure SwiftData framework</li>
              <li>Can be revoked at any time through iOS Settings → Nahtadi → Location</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Without location access, you can still use the app by manually entering your city or
              coordinates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Nahtadi does NOT integrate any third-party analytics, advertising, tracking, or data
              collection services. The app functions completely independently without external
              dependencies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              This app does not knowingly collect information from children under 13 years of age.
              Since no data is collected at all, the app is safe for users of all ages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Any updates to this privacy policy will be posted on this page with a revised "Last
              Updated" date. We recommend checking this page periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this privacy policy or the Nahtadi app, please contact us:
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:support@hendaseh.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                support@hendaseh.com
              </a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Nahtadi is developed by{' '}
              <a
                href="https://hendaseh.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Hendaseh
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
