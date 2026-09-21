import type { GetServerSidePropsContext } from 'next';

import { UserAuth } from 'api/auth/APIDetail';
import { KOIN_BASE_URL } from 'static/url';
import APIClient from 'utils/ts/apiClient';
import type { UserType } from 'utils/zustand/auth';

export type DeviceClass = 'mobile' | 'desktop';

export interface ServerRequestContext {
  device: DeviceClass;
  isLoggedIn: boolean;
  /**
   * access는 HttpOnly 쿠키라 프론트가 값을 읽거나 props/hydration으로 내려보낼 수 없다
   * (web-cookie-auth.md). 과거 raw JWT를 여기 담아 쿼리 키로 쓰던 필드였지만, 이제는 항상
   * `''`이다 — 남겨둔 이유는 이 필드를 여전히 폴백으로 참조하는 레거시 훅(`useTokenState` 등,
   * Phase 3에서 제거 예정)과의 호환성 때문이다.
   */
  token: string;
  /** 로그인 상태일 때만 의미 있다. `GET /user/auth`로 서버가 직접 확인한 값이다. */
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
 * access는 HttpOnly라 프론트가 직접 디코딩할 수 없다 — 로그인 여부·회원 유형은 원본 Cookie를
 * 그대로 실어 `GET /user/auth`를 호출해 백엔드가 직접 확인한다(web-cookie-auth.md).
 */
export async function getServerRequestContext(context: GetServerSidePropsContext): Promise<ServerRequestContext> {
  const device = getDeviceClass(context.req.headers['user-agent']);
  const now = new Date().toISOString();
  const cookie = context.req.headers.cookie;

  if (!cookie) {
    return { device, isLoggedIn: false, token: '', userType: null, now };
  }

  try {
    const { user_type: userType } = await APIClient.request(new UserAuth({ Cookie: cookie, Origin: KOIN_BASE_URL }));

    return { device, isLoggedIn: true, token: '', userType, now };
  } catch {
    return { device, isLoggedIn: false, token: '', userType: null, now };
  }
}
