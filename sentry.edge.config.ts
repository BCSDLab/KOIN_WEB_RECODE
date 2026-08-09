import { maskSensitive } from 'utils/ts/maskSensitive';
import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const isProduction = environment === 'production';

/** 민감 파일을 탐색하는 봇 요청 경로. 애플리케이션 결함이 아니므로 이슈로 만들지 않는다. */
const BOT_PROBE_PATTERN = /\/(\.env|\.git|\.aws|wp-admin|wp-login|phpmyadmin|\.well-known\/security)/i;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // 미들웨어는 모든 요청을 통과하므로 봇 스캔이 그대로 유입된다.
  beforeSend(event) {
    if (event.request?.url && BOT_PROBE_PATTERN.test(event.request.url)) return null;
    return event;
  },

  beforeSendLog(log) {
    if (log.level === 'debug') return null;
    // API가 인증 실패 응답에 토큰 원문을 실어 보내고, 그 메시지가 그대로 로그로 넘어온다.
    return maskSensitive(log);
  },

  enableLogs: true,
  tracesSampleRate: isProduction ? 0.7 : 0.1,
  sendDefaultPii: true,
});
