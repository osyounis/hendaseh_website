import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nahtadi - Islamic Prayer Times | Omar Younis',
  description: 'Nahtadi is an iOS app that calculates the five daily Islamic prayer times and provides the Qibla direction. Built with SwiftUI.',
};

export default function IOSAppPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link
        href="/projects"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block font-medium transition-colors"
      >
        ← Back to Projects
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Nahtadi
      </h1>
      <p className="text-xl text-gray-600 mb-8">Islamic Prayer Times & Qibla Direction</p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-yellow-800">
          <strong>Coming Soon:</strong> This app is currently in development (v0.1.0)
          and will be available on the App Store soon.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>About Nahtadi</h2>
        <p>
          Nahtadi (نهتدي) is an iOS application that calculates the five daily Islamic prayer times
          (Fajr, Dhuhr, Asr, Maghrib, Isha) as well as sunrise, and provides the Qibla direction
          (direction to the Kaaba in Mecca). The app is built with SwiftUI and SwiftData, using
          Apple's modern declarative UI framework and persistent data storage.
        </p>
        <p>
          The prayer time calculations are based on the same astronomical algorithms used in my{' '}
          <a
            href="https://github.com/osyounis/islamic_prayer_time_app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Islamic Prayer Time Python library
          </a>
          , ported to Swift for native iOS performance.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li><strong>Prayer Time Calculations</strong>: Accurate calculation of all five daily Islamic prayer times plus sunrise</li>
          <li><strong>Multiple Calculation Methods</strong>: Support for various calculation methods (ISNA, MWL, UQU, EGAS, etc.)</li>
          <li><strong>Qibla Compass</strong>: Real-time Qibla direction using device GPS and compass</li>
          <li><strong>Hijri Calendar</strong>: Gregorian to Hijri calendar conversion</li>
          <li><strong>High Latitude Support</strong>: Automatic handling for regions above 48.5° latitude</li>
          <li><strong>Prayer Notifications</strong>: Reminders for each prayer time</li>
          <li><strong>Dark Mode Support</strong>: Native iOS dark mode compatibility</li>
          <li><strong>Offline Capable</strong>: Works without internet connection after initial setup</li>
        </ul>

        <h2>Screenshots</h2>
        <p>Screenshots will be added when the app is ready.</p>

        {/* Future: Add App Store badge */}
        {/*
        <div className="my-8">
          <a href="APP_STORE_LINK">
            <img
              src="/app-store-badge.svg"
              alt="Download on the App Store"
              className="h-14"
            />
          </a>
        </div>
        */}

        <h2>Privacy Policy</h2>
        <p>
          A privacy policy will be available before the app is released to the App Store.
          {/*
          <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
            View Privacy Policy
          </Link>
          */}
        </p>

        <h2>Development Status</h2>
        <p>
          This iOS application is currently in development. Check back soon for updates,
          screenshots, and feature details.
        </p>
      </div>
    </div>
  );
}
