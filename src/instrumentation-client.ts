import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const isProduction = environment === 'production';

/** React 19가 하이드레이션 실패 시 console.error로 출력하는 메시지 패턴 */
const HYDRATION_ERROR_PATTERN = /Hydration failed|didn't match|Text content does not match|error while hydrating/i;

interface KoinErrorLike {
  type?: string;
  status?: number;
  code?: string;
}

function asKoinError(error: unknown): KoinErrorLike | null {
  if (error == null || typeof error !== 'object') return null;
  const candidate = error as KoinErrorLike;
  return candidate.type === 'KOIN_ERROR' ? candidate : null;
}

/**
 * 하이드레이션 실패 시 React가 출력하는 diff 전문을 경로별로 그룹핑해 보고한다.
 *
 * Sentry의 replay hydration breadcrumb에는 diff가 담기지 않아, 어느 컴포넌트가 깨졌는지
 * 알 수 없었다. consoleLoggingIntegration이 전문을 Logs로 보내주지만 Logs는 그룹핑이
 * 되지 않으므로, 경로별 이슈는 여기서 따로 만든다.
 */
function reportHydrationDiff() {
  if (typeof window === 'undefined') return;

  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args.map((arg) => (arg instanceof Error ? arg.message : String(arg))).join(' ');

    if (HYDRATION_ERROR_PATTERN.test(message)) {
      Sentry.captureMessage('hydration-diff', {
        level: 'error',
        fingerprint: ['hydration', window.location.pathname],
        extra: {
          path: window.location.pathname,
          search: window.location.search,
          diff: message.slice(0, 8000),
        },
      });
    }

    originalError(...args);
  };
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

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

    const koinError = asKoinError(error);
    if (koinError) {
      // 401: 토큰 만료. 미들웨어와 useAutoLogin이 처리하는 정상 흐름이다.
      // 404: 삭제된 게시글 등에 접근. 페이지에서 안내하므로 알림 대상이 아니다.
      if (koinError.status === 401 || koinError.status === 404) return null;

      // KoinError는 Error 인스턴스가 아니라 plain object다. 그대로 두면 Sentry가
      // "Object captured as exception with keys: ..." 로 묶어 서로 다른 에러가 한 이슈에
      // 뒤섞이고 스택도 남지 않는다. 상태 코드별로 그룹을 분리한다.
      event.fingerprint = ['koin-error', String(koinError.status), koinError.code || 'no-code'];
      event.exception?.values?.forEach((value) => {
        value.type = `KoinError(${koinError.status ?? 'unknown'})`;
      });
    }

    return event;
  },

  beforeSendLog(log) {
    if (log.level === 'debug') return null;
    return log;
  },

  ignoreErrors: [
    // Next 라우터가 같은 URL로 이동할 때 발생. 동작에 영향 없다.
    'attempted to hard navigate to the same URL',
    // 브라우저 양성 노이즈
    'ResizeObserver loop',
    'Non-Error promise rejection captured',
  ],

  denyUrls: [
    // 확장 프로그램·인앱 브라우저가 주입한 스크립트
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    /^safari-(web-)?extension:\/\//,
    // 서드파티 분석 스크립트
    /googletagmanager\.com/,
    /google-analytics\.com/,
  ],

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
    // plain object로 throw된 에러의 추가 속성을 이벤트에 붙인다 (KoinError 대응)
    Sentry.extraErrorDataIntegration(),
    // console.warn/error 를 Sentry Logs로 전달한다. 하이드레이션 diff 전문이 여기 담긴다.
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
    // Degraded UI Performance / Blocking Operation / Rage Click 의 원인 파악용.
    // next.config.mjs 의 Document-Policy: js-profiling 헤더가 있어야 동작한다.
    Sentry.browserProfilingIntegration(),
  ],

  tracePropagationTargets: [
    'localhost',
    ...(process.env.NEXT_PUBLIC_API_PATH ? [process.env.NEXT_PUBLIC_API_PATH] : []),
  ],

  enableLogs: true,
  tracesSampleRate: isProduction ? 0.7 : 1.0,
  // tracesSampleRate 로 샘플링된 트랜잭션에 대한 상대 비율이다.
  // UI Profile Hours 는 월 150시간으로, Logs(5TB)와 달리 실제로 한정된 쿼터다.
  // 월 페이지뷰 약 69만 x 트레이스 0.7 = 48만 트랜잭션이므로 1.0 으로 두면 며칠 만에 소진된다.
  // 0.1 이면 월 약 4.8만 프로파일(약 67시간)로 여유 있게 들어온다.
  profilesSampleRate: isProduction ? 0.1 : 1.0,
  replaysSessionSampleRate: isProduction ? 0.3 : 0.0,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
});

reportHydrationDiff();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
