import Image from 'next/image';

interface PlatformButtonsProps {
  appStoreUrl?: string | null;
  appStoreLive?: boolean;
}

/**
 * The hero's call to action.
 *
 * THE OFFICIAL APPLE BADGE, USED UNMODIFIED — not recoloured, not restyled,
 * not rebuilt as a pill. Apple's marketing guidelines require the artwork as
 * shipped, and the projects contract names /nahtadi as the ONE page it appears
 * on. `imagekitLoader` has a matching SVG bypass so the badge is never sent
 * through a transform that would rasterise Apple's trademarked vector to PNG.
 *
 * Layout, press and hover live on `.nh-hero-cta` in styles/nahtadi.css, so
 * this component contributes markup and nothing else.
 *
 * The not-live branch is defensive rather than dead: `appStoreLive` is true in
 * projects.json today, and this component is what keeps a wrong badge off the
 * page if that ever flips back. It takes the flagship pill's own tokens, so it
 * reads as part of the green band instead of as raw markup nobody styled.
 */
export default function PlatformButtons({
  appStoreUrl,
  appStoreLive = false,
}: PlatformButtonsProps) {
  if (!appStoreLive || !appStoreUrl) {
    return (
      <span className="pill pill-on-flagship" aria-disabled="true">
        Coming soon to the App Store
      </span>
    );
  }

  return (
    <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
      {/* THE BADGE'S OWN INTRINSIC SIZE (the SVG is 119.66 x 40), not its
          rendered size — `.nh-hero-cta img` sets the 172px width and lets the
          height follow. Passing the rendered pair instead makes next/image see
          exactly one of the two dimensions modified by CSS and warn about a
          broken aspect ratio: 172 wide is unmodified while `height: auto`
          resolves to 57.48 against a declared 58. Describing the source here
          and the layout in CSS is the combination the component expects. */}
      <Image
        src="/images/app-store-badge.svg"
        alt="Download on the App Store"
        width={120}
        height={40}
      />
    </a>
  );
}
