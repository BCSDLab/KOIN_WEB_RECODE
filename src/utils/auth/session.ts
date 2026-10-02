import { WEB_AUTH_CSRF_COOKIE_KEY } from 'static/url';
import type { ServerRequestContext } from 'utils/ssr/requestContext';
import { getCookie } from 'utils/ts/cookie';

export type UserType = 'STUDENT' | 'GENERAL';

export type Session = { status: 'authenticated'; userType: UserType } | { status: 'anonymous' };

export const ANONYMOUS_SESSION: Session = { status: 'anonymous' };

export const SESSION_QUERY_KEY = ['auth', 'session'] as const;

export const authenticatedSession = (userType: UserType): Session => ({ status: 'authenticated', userType });

// 총학생회는 학생 정보를 가지므로 학생으로 다룬다.
export const toUserType = (value: string | null | undefined): UserType | null => {
  if (value === 'GENERAL') return 'GENERAL';
  if (value === 'STUDENT' || value === 'COUNCIL') return 'STUDENT';

  return null;
};

export const toSession = (serverRequest: ServerRequestContext | null): Session =>
  serverRequest?.isLoggedIn && serverRequest.userType
    ? authenticatedSession(serverRequest.userType)
    : ANONYMOUS_SESSION;

// CSRF 쿠키는 refresh와 만료 시각이 같고 서버가 세션 소멸 시 함께 지운다. 없으면 세션이 없다고 본다.
export const hasSessionCookie = () => typeof document !== 'undefined' && !!getCookie(WEB_AUTH_CSRF_COOKIE_KEY);
