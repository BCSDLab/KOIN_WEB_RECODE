import { WEB_AUTH_CSRF_COOKIE_KEY } from 'static/url';
import type { ServerRequestContext } from 'utils/ssr/requestContext';
import { getCookie } from 'utils/ts/cookie';

export type UserType = 'STUDENT' | 'GENERAL';

/** 웹 로그인 세션. 비로그인은 에러가 아니라 정상 값이다. 값을 정하는 곳은 세션 쿼리(`authQueries.session`) 하나다. */
export type Session = { status: 'authenticated'; userType: UserType } | { status: 'anonymous' };

export const ANONYMOUS_SESSION: Session = { status: 'anonymous' };

export const SESSION_QUERY_KEY = ['auth', 'session'] as const;

export const authenticatedSession = (userType: UserType): Session => ({ status: 'authenticated', userType });

/** 백엔드 회원 유형을 웹이 구분하는 유형으로 좁힌다. 총학생회는 학생 정보를 가지므로 학생으로 다룬다. */
export const toUserType = (value: string | null | undefined): UserType | null => {
  if (value === 'GENERAL') return 'GENERAL';
  if (value === 'STUDENT' || value === 'COUNCIL') return 'STUDENT';

  return null;
};

/** 서버가 세션 조회로 확인한 값에서 세션을 만든다. */
export const toSession = (serverRequest: ServerRequestContext | null): Session =>
  serverRequest?.isLoggedIn && serverRequest.userType ? authenticatedSession(serverRequest.userType) : ANONYMOUS_SESSION;

/**
 * CSRF 쿠키는 일반 쿠키이고 refresh와 만료 시각이 같다. 없다고 세션이 없다는 보장은 없고(다른 쿠키만 남을 수 있다),
 * 있다고 유효하다는 보장도 없다(서버에서 폐기될 수 있다). 최종 판정은 `/user/auth`가 한다.
 */
export const hasSessionCookie = () => typeof document !== 'undefined' && !!getCookie(WEB_AUTH_CSRF_COOKIE_KEY);
