import type { GetServerSidePropsContext } from 'next';
import { COOKIE_KEY } from 'static/url';

export type DeviceClass = 'mobile' | 'desktop';

export interface ServerRequestContext {
  device: DeviceClass;
  isLoggedIn: boolean;
  /**
   * SSR 렌더용 토큰. `useTokenStore`는 서버에서 쿠키를 못 읽어 `''`을 반환하므로,
   * 토큰이 쿼리 키에 들어가는 훅들이 서버에서 데이터를 찾지 못한다.
   *
   * 로그인 응답은 `withCacheControl`이 `private, no-store`로 고정하고 nginx도
   * `proxy_no_cache $skip_cache`로 저장하지 않으므로 공유 캐시에 실리지 않는다.
   */
  token: string;
  /** 토큰과 함께 요청 엔드포인트를 결정한다. 빠뜨리면 잘못된 엔드포인트로 403이 난다. */
  userType: string;
  /**
   * 서버 렌더 시각(ISO). 시각 파생 렌더의 공통 기준값이다.
   *
   * 공유 캐시로 최대 60초 낡을 수 있으나, 클라이언트가 자기 기기 시계로 다시 계산해
   * 매번 DOM을 갈아치우는 것보다 낫다.
   */
  now: string;
}

/**
 * UA로 기기를 분류한다.
 *
 * nginx 캐시 키(`$device_class`, /etc/nginx/conf.d/proxy-cache.conf)가 같은 정규식을 쓴다.
 * 한쪽만 바꾸면 캐시가 잘못 갈려 다른 기기용 HTML이 서빙되므로 반드시 함께 수정할 것.
 */
const MOBILE_UA = /iphone|ipod|android.*mobile|windows phone/i;

export function getDeviceClass(userAgent: string | undefined): DeviceClass {
  return userAgent && MOBILE_UA.test(userAgent) ? 'mobile' : 'desktop';
}

/**
 * 서버만 아는 요청 정보를 렌더 트리에 넘기기 위해 추출한다.
 *
 * 이 값들이 없으면 서버는 "비로그인 데스크톱"을 가정해 렌더하고, 클라이언트는 마운트 후
 * 실제 값으로 다시 그린다. 그 과정에서 서버가 그린 DOM이 통째로 버려진다.
 *
 * 인증 상태를 SSR에 반영해도 캐시는 안전하다. nginx가 인증 쿠키가 있으면
 * `proxy_cache_bypass`/`proxy_no_cache`로 캐시를 우회한다.
 */
export function getServerRequestContext(context: GetServerSidePropsContext): ServerRequestContext {
  const token = context.req.cookies[COOKIE_KEY.AUTH_TOKEN] ?? '';

  return {
    device: getDeviceClass(context.req.headers['user-agent']),
    isLoggedIn: Boolean(token),
    token,
    userType: context.req.cookies[COOKIE_KEY.AUTH_USER_TYPE] ?? '',
    now: new Date().toISOString(),
  };
}
