import { maskSensitive } from 'utils/ts/maskSensitive';
import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const isProduction = environment === 'production';

/** 민감 파일을 탐색하는 봇 요청 경로. 애플리케이션 결함이 아니므로 이슈로 만들지 않는다. */
const BOT_PROBE_PATTERN = /\/(\.env|\.git|\.aws|wp-admin|wp-login|phpmyadmin|\.well-known\/security)/i;

interface KoinErrorLike {
  type?: string;
  status?: number;
  code?: number;
}

function asKoinError(error: unknown): KoinErrorLike | null {
  if (error == null) return null;

  if (typeof error === 'object') {
    const candidate = error as KoinErrorLike;
    if (candidate.type === 'KOIN_ERROR') return candidate;
  }

  // Next.js의 getProperError()가 _error.tsx의 getInitialProps 재전파 경로에서
  // plain object KoinError를 new Error(JSON.stringify(koinError))로 감싼다.
  // 이 경우 message가 KoinError의 JSON 문자열이라 위 object 체크로는 못 잡는다.
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as KoinErrorLike;
      if (parsed?.type === 'KOIN_ERROR') return parsed;
    } catch {
      return null;
    }
  }

  return null;
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  beforeSend(event, hint) {
    if (event.request?.url && BOT_PROBE_PATTERN.test(event.request.url)) return null;

    const koinError = asKoinError(hint.originalException);
    if (koinError) {
      // 401(토큰 만료) · 404(삭제된 리소스)는 정상 흐름이므로 이슈로 만들지 않는다.
      if (koinError.status === 401 || koinError.status === 404) return null;

      // KoinError는 Error 인스턴스가 아니라 plain object다. 그대로 두면 Sentry가
      // "Object captured as exception with keys: ..." 로 묶어 서로 다른 에러가 한 이슈에
      // 뒤섞이고 스택도 남지 않는다. 상태 코드별로 그룹을 분리한다.
      event.fingerprint = ['koin-error', String(koinError.status), String(koinError.code ?? 'no-code')];
      event.exception?.values?.forEach((value) => {
        value.type = `KoinError(${koinError.status ?? 'unknown'})`;
      });
    }

    return event;
  },

  beforeSendLog(log) {
    if (log.level === 'debug') return null;
    // API가 인증 실패 응답에 토큰 원문을 실어 보내고, 그 메시지가 그대로 로그로 넘어온다.
    return maskSensitive(log);
  },

  // plain object로 throw된 에러의 추가 속성을 이벤트에 붙인다 (KoinError 대응)
  integrations: [Sentry.extraErrorDataIntegration()],

  enableLogs: true,
  tracesSampleRate: isProduction ? 0.7 : 0.1,
  sendDefaultPii: true,
});
