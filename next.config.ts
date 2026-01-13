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
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.hendaseh.com',
          },
        ],
        destination: 'https://hendaseh.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
