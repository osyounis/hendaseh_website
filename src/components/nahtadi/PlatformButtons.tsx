import Image from 'next/image';

interface PlatformButtonsProps {
  appStoreUrl?: string | null;
  googlePlayUrl?: string | null;
  appStoreLive?: boolean;
  googlePlayLive?: boolean;
  showBothPlatforms?: boolean;
}

export default function PlatformButtons({
  appStoreUrl,
  googlePlayUrl,
  appStoreLive = false,
  googlePlayLive = false,
  showBothPlatforms = true,
}: PlatformButtonsProps) {
  const showAppStore = appStoreLive && appStoreUrl;
  const showGooglePlay = googlePlayLive && googlePlayUrl && showBothPlatforms;
  const showAnyBadge = showAppStore || showGooglePlay;

  // If no badges to show, display "Coming Soon" message
  if (!showAnyBadge) {
    return (
      <div className="inline-block">
        <button
          disabled
          className="bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-not-allowed backdrop-blur-sm border border-white/30 shadow-sm"
        >
          Coming Soon to App Stores
        </button>
        <p className="text-sm text-white/90 mt-3 text-center">
          Currently in development • Expected Early 2026
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      {/* App Store Badge - Always first (left on desktop, top on mobile) */}
      {showAppStore && (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src="/images/app-store-badge.svg"
            alt="Download on the App Store"
            width={160}
            height={54}
            className="h-auto"
          />
        </a>
      )}

      {/* Google Play Badge - Second (right on desktop, bottom on mobile) */}
      {showGooglePlay && (
        <a
          href={googlePlayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src="/images/google-play-badge.svg"
            alt="Get it on Google Play"
            width={175}
            height={52}
            className="h-auto"
          />
        </a>
      )}
    </div>
  );
}
