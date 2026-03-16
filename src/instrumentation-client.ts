import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const isProduction = environment === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

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
