import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /*
   * Hosts allowed to request dev-only assets. DEV ONLY -- Next reads this in
   * `next dev` and nowhere else, so it has no effect on the build, the Worker,
   * or production.
   *
   * Next 16 blocks cross-origin requests to `/_next/*` by default. Loading the
   * dev server from a phone over the LAN is a cross-origin request, so without
   * this the phone silently gets HTML with no JavaScript: React never boots,
   * every interactive element is dead, and the dev client keeps restarting CSS
   * animations. It does not look like a blocked request -- it looks like the
   * site is broken. That misread a whole review cycle: a dead hamburger and
   * "flickering" motion were both this, not the code under test.
   *
   * Matching is per dot-segment from the right (see `isCsrfOriginAllowed` in
   * next/dist/server/app-render/csrf-protection.js), so `192.168.1.*` matches
   * every host on that subnet and nothing outside it. Add a line for another
   * network when you need one -- an iPhone Personal Hotspot, for instance,
   * hands out `172.20.10.*`.
   *
   * This makes the dev server WORK from a phone; it does not make the dev
   * server the right phone-test target. Real-device checks run against
   * `npm run preview` -- see "Real-device testing" in .claude/CLAUDE.md.
   */
  allowedDevOrigins: ['192.168.1.*', '192.168.0.*'],
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imagekitLoader.ts',
  },
  async redirects() {
    return [
      { source: '/capabilities', destination: '/about', permanent: true },
      // Nahtadi is the flagship and lives at the frozen /nahtadi URL. The old
      // sitemap listed /projects/nahtadi; with dynamicParams = false that slug
      // now 404s, so redirect it rather than dropping an indexed URL.
      { source: '/projects/nahtadi', destination: '/nahtadi', permanent: true },
      // The runtime /api/og route is gone (sharp + node:fs cannot run on
      // Cloudflare Workers); cards are pre-rendered into /public/og. Redirect
      // any URL already in the wild to its static PNG.
      {
        source: '/api/og',
        has: [{ type: 'query', key: 'card', value: '(?<card>[a-z0-9-]+)' }],
        destination: '/og/:card.png',
        permanent: false,
      },
      { source: '/api/og', destination: '/og/site.png', permanent: false },
    ];
  },
};

export default nextConfig;
