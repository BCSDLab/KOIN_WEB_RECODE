import { getWebSession } from 'api/auth';

import { ANONYMOUS_SESSION, authenticatedSession, hasSessionCookie, type Session, toUserType } from './session';

// CSRF 쿠키가 없으면 세션이 없다고 보고 요청하지 않는다.
export default async function fetchSession(): Promise<Session> {
  if (!hasSessionCookie()) return ANONYMOUS_SESSION;

  const { authenticated, user_type: userType } = await getWebSession();
  const resolved = authenticated ? toUserType(userType) : null;

  return resolved ? authenticatedSession(resolved) : ANONYMOUS_SESSION;
}
