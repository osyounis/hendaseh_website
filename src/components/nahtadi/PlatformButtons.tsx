import Image from 'next/image';

interface PlatformButtonsProps {
  appStoreUrl?: string | null;
  appStoreLive?: boolean;
}

export default function PlatformButtons({
  appStoreUrl,
  appStoreLive = false,
}: PlatformButtonsProps) {
  const showAppStore = appStoreLive && appStoreUrl;

  // If no badge to show, display "Coming Soon" message
  if (!showAppStore) {
    return (
      <div className="inline-block">
        <button
          disabled
          className="bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-not-allowed backdrop-blur-sm border border-white/30 shadow-sm"
        >
          Coming Soon to the App Store
        </button>
        <p className="text-sm text-white/90 mt-3 text-center">
          Currently in development • Expected Early 2026
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
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
    </div>
  );
}
