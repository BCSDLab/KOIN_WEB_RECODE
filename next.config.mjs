import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [],
            },
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024,
        },
      },
    });

    return config;
  },
  experimental: {
    workerThreads: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stage-static.koreatech.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.koreatech.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bcsdlab.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || 'bcsd',
  project: process.env.SENTRY_PROJECT || 'koin-prod',
  release: { name: process.env.NEXT_PUBLIC_SENTRY_RELEASE },
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
});
