import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        jsdom: false,
      };
    }

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
    reactCompiler: true,
    workerThreads: false,
  },
  async headers() {
    return [
      {
        // 브라우저 프로파일링(Sentry browserProfilingIntegration)은 이 헤더가 없으면
        // 오류 없이 조용히 아무 데이터도 수집하지 않는다.
        source: '/:path*',
        headers: [{ key: 'Document-Policy', value: 'js-profiling' }],
      },
    ];
  },
  images: {
    // 이 값이 최적화 결과의 디스크 캐시 수명과 응답 Cache-Control 을 함께 결정한다.
    // 기본값 60초로 두면 브라우저·nginx 캐시까지 60초로 묶인다.
    // 업로드 URL 이 UUID 기반이라 불변이므로 길게 잡는다. URL 재사용 운영을 한다면 줄일 것.
    minimumCacheTTL: 2678400, // 31일
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
  release: {
    name: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    // 릴리스에 포함된 커밋을 연결한다. 이슈마다 원인 커밋(Suspect Commits)이 표시되고
    // 어느 릴리스에서 유입이 시작됐는지 추적할 수 있다.
    // CI 밖(로컬 빌드 등)에서는 커밋 정보가 없어 실패할 수 있으므로 ignoreMissing 을 켠다.
    setCommits: { auto: true, ignoreMissing: true },
  },
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
