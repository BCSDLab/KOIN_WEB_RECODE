import type { GetServerSidePropsContext } from 'next';

import { WebSession } from 'api/auth/APIDetail';
import { KOIN_BASE_URL, WEB_AUTH_ACCESS_COOKIE_KEY } from 'static/url';
import { toUserType, type UserType } from 'utils/auth/session';
import APIClient from 'utils/ts/apiClient';

export type DeviceClass = 'mobile' | 'desktop';

export interface ServerRequestContext {
  device: DeviceClass;
  isLoggedIn: boolean;
  /** `GET /v2/web/auth/session`으로 서버가 직접 확인한 값. 로그인 상태일 때만 의미 있다. */
  userType: UserType | null;
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
 *
 * 세션 유효성은 원본 Cookie를 그대로 실어 세션 조회(`GET /v2/web/auth/session`)로 백엔드가 확인한다.
 */
// 요청 처리 중에 만료되지 않도록 둔 여유
const ACCESS_EXPIRY_MARGIN_MS = 10_000;

/**
 * 서버는 access를 갱신할 수 없으므로 만료됐으면 비로그인으로 렌더하고 클라이언트가 갱신하게 둔다.
 * 세션 조회는 refresh가 함께 오면 access가 만료돼도 authenticated를 돌려주는데(로컬 개발 프록시가 그렇다),
 * 그대로 로그인으로 렌더하면 인증 요청이 401로 실패한다. 운영에선 만료 시 세션 조회 요청 자체를 아낀다.
 * HttpOnly는 브라우저 JS만 막으므로 서버는 Cookie 헤더의 JWT에서 만료 시각을 읽을 수 있다.
 */
function hasUsableAccessToken(accessToken: string | undefined): boolean {
  const payload = accessToken?.split('.')[1];
  if (!payload) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());

    return typeof exp === 'number' && exp * 1000 > Date.now() + ACCESS_EXPIRY_MARGIN_MS;
  } catch {
    return false;
  }
}

export async function getServerRequestContext(context: GetServerSidePropsContext): Promise<ServerRequestContext> {
  const device = getDeviceClass(context.req.headers['user-agent']);
  const now = new Date().toISOString();
  const cookie = context.req.headers.cookie;

  if (!cookie || !hasUsableAccessToken(context.req.cookies[WEB_AUTH_ACCESS_COOKIE_KEY])) {
    return { device, isLoggedIn: false, userType: null, now };
  }

  try {
    const session = await APIClient.request(new WebSession({ Cookie: cookie, Origin: KOIN_BASE_URL }));
    const userType = session.authenticated ? toUserType(session.user_type) : null;

    return { device, isLoggedIn: userType !== null, userType, now };
  } catch {
    return { device, isLoggedIn: false, userType: null, now };
  }
}
