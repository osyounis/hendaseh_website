import type { ImageLoaderProps } from 'next/image';

const ENDPOINT = 'https://ik.imagekit.io/osyounis';

export default function imagekitLoader({ src, width, quality }: ImageLoaderProps) {
  // Dev serves originals — ImageKit's web-folder origin can't reach localhost.
  if (process.env.NODE_ENV === 'development') return src;

  // Serve SVGs as-is, unoptimized. Next's default loader has a built-in bypass
  // for this (get-img-props.js: `isDefaultLoader && !dangerouslyAllowSVG &&
  // src.endsWith('.svg')` -> unoptimized = true), but that bypass is gated on
  // `isDefaultLoader` and is lost entirely once a custom loader is configured.
  // Without replicating it here, the App Store badge
  // (PlatformButtons.tsx -> /images/app-store-badge.svg) would be sent through
  // ImageKit's tr: transform, which rasterizes SVGs to PNG on the fly —
  // silently swapping Apple's trademarked vector badge for a raster image.
  // Match Next's own test exactly: strip any query string before checking
  // the extension, so `foo.svg?v=2` is treated the same as `foo.svg`.
  if (src.split('?', 1)[0].toLowerCase().endsWith('.svg')) return src;

  return `${ENDPOINT}/tr:w-${width},q-${quality ?? 75},f-auto${src}`;
}
