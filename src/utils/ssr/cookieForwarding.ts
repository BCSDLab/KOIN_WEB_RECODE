import { AsyncLocalStorage } from 'node:async_hooks';

export interface ServerRequestHeaders {
  cookie: string;
  origin: string;
}

const storage = new AsyncLocalStorage<ServerRequestHeaders>();

/**
 * SSR 요청 범위 동안 원본 Cookie/Origin을 ambient context에 실어둔다.
 *
 * httpOnly 쿠키 전환 이후 Node 서버가 만드는 아웃바운드 axios 요청에는 브라우저의
 * 쿠키 자동 첨부가 적용되지 않는다(`withCredentials`는 브라우저 전용 옵션). 이 스토어가
 * 없으면 `apiClient.ts`의 모든 SSR 요청이 인증 정보 없이 나가 401이 난다.
 */
export function runWithServerRequestHeaders<T>(headers: ServerRequestHeaders, fn: () => T): T {
  return storage.run(headers, fn);
}

export function getServerRequestHeaders(): ServerRequestHeaders | undefined {
  return storage.getStore();
}
