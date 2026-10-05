/**
 * JWT 형태의 문자열을 가린다.
 *
 * API가 인증 실패 응답에 토큰 원문을 실어 보내고(`"올바르지 않은 인증정보입니다. token: eyJ..."`),
 * consoleLoggingIntegration이 그 메시지를 그대로 Sentry Logs로 보내고 있었다.
 * Sentry의 서버측 스크러빙은 `message` 필드는 걸러도 로그 본문까지 보장하지 않는다.
 */
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+/g;

export function maskSensitive<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(JWT_PATTERN, '[REDACTED_JWT]') as T;
  }

  if (Array.isArray(value)) {
    return value.map(maskSensitive) as T;
  }

  if (value != null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, maskSensitive(entry)]),
    ) as T;
  }

  return value;
}
