import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const isProduction = environment === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // GTM이 Dynatrace RUM 태그를 실행할 때 dtrum 스크립트가 없으면 발생하는 서드파티 에러
  ignoreErrors: [/dtrum is not defined/],

  beforeSend(event, hint) {
    const error = hint.originalException;

    // Axios 네트워크/타임아웃/취소 에러
    if (
      error != null
      && typeof error === 'object'
      && 'code' in error
      && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED')
    ) {
      return null;
    }

    // 브라우저 네트워크 에러 (fetch, Safari)
    if (error instanceof TypeError && /Load failed|Failed to fetch/.test(error.message)) {
      return null;
    }

    // 배포 후 이전 청크 캐시 요청 실패
    if (error instanceof Error && error.name === 'ChunkLoadError') {
      return null;
    }

    return event;
  },

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
  ],

  tracePropagationTargets: [
    'localhost',
    ...(process.env.NEXT_PUBLIC_API_PATH ? [process.env.NEXT_PUBLIC_API_PATH] : []),
  ],

  tracesSampleRate: isProduction ? 0.7 : 1.0,
  replaysSessionSampleRate: isProduction ? 0.3 : 0.0,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
