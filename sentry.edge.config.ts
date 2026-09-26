import { maskSensitive } from 'utils/ts/maskSensitive';
import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

/** 민감 파일을 탐색하는 봇 요청 경로. 애플리케이션 결함이 아니므로 이슈로 만들지 않는다. */
const BOT_PROBE_PATTERN = /\/(\.env|\.git|\.aws|wp-admin|wp-login|phpmyadmin|\.well-known\/security)/i;

function getTransactionKey(transaction: string | undefined): string | undefined {
  if (!transaction) return undefined;
  if (/\/_next\/image(?:\?|$)/.test(transaction)) return 'next_image';
  if (/\/articles\/(?:\[id\]|:id|[0-9]+)(?:\/|\?|$)/.test(transaction)) return 'article_detail';
  return undefined;
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  beforeSendTransaction(event) {
    const transactionKey = getTransactionKey(event.transaction);
    if (transactionKey) {
      event.tags = { ...event.tags, 'koin.transaction_key': transactionKey };
    }
    return event;
  },

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
  tracesSampleRate: 1.0,
  // 자격증명급 위험이 있는 항목만 최소로 차단한다. cookie 헤더는 httpHeaders가 아니라
  // 별도의 cookies 옵션으로 처리되므로 여기 deny에 넣어도 효과가 없다.
  // frameContextLines: 7은 sendDefaultPii: true 시절의 기본값을 그대로 유지한 것이다.
  dataCollection: {
    cookies: false,
    httpHeaders: {
      request: { deny: ['authorization', 'referer'] },
      response: { deny: ['authorization', 'referer'] },
    },
    frameContextLines: 7,
  },
});
