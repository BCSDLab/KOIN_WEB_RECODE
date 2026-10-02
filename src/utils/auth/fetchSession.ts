import { getWebSession } from 'api/auth';

import { ANONYMOUS_SESSION, authenticatedSession, hasSessionCookie, type Session, toUserType } from './session';

/**
 * 서버(`GET /v2/web/auth/session`)로 세션을 확인한다. 비로그인도 오류가 아닌 200이라 오류 해석이 필요 없다.
 * 서버는 refresh 세션이 유효하면 access가 만료돼도 로그인으로 응답하고, CSRF 쿠키를 복구한다.
 * CSRF 쿠키가 없으면 세션이 없다고 보고 요청하지 않는다(서버가 세션 소멸 시 쿠키를 함께 지운다).
 */
export default async function fetchSession(): Promise<Session> {
  if (!hasSessionCookie()) return ANONYMOUS_SESSION;

  const { authenticated, user_type: userType } = await getWebSession();
  const resolved = authenticated ? toUserType(userType) : null;

  return resolved ? authenticatedSession(resolved) : ANONYMOUS_SESSION;
}
