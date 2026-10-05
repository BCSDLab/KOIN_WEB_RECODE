import type { ServerRequestHeaders } from './cookieForwarding';

/**
 * `cookieForwarding.ts`의 클라이언트 번들용 대체 구현.
 *
 * `node:async_hooks`는 브라우저에서 resolve되지 않으므로 next.config의 webpack alias가
 * 클라이언트 빌드에서 이 파일로 치환한다. 클라이언트에서는 SSR 요청 컨텍스트가 존재하지
 * 않으므로 항상 no-op이다.
 */
export function runWithServerRequestHeaders<T>(_headers: ServerRequestHeaders, fn: () => T): T {
  return fn();
}

export function getServerRequestHeaders(): ServerRequestHeaders | undefined {
  return undefined;
}
