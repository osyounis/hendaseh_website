import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
