import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const isProduction = environment === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  tracesSampleRate: isProduction ? 0.7 : 0.1,
  sendDefaultPii: true,
});
