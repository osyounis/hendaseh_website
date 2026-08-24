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
    ];
  },
};

export default nextConfig;
