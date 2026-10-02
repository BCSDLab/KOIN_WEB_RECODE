import { isKoinError } from '@bcsdlab/koin';
import { getUserAuth, webCsrf } from 'api/auth';

import { ANONYMOUS_SESSION, authenticatedSession, hasSessionCookie, type Session } from './session';
import { useSessionHintStore } from './sessionHint';

/**
 * 서버(`/user/auth`)로 세션을 확인한다.
 * - CSRF 쿠키도 힌트도 없으면 요청 없이 anonymous.
 * - CSRF 쿠키만 없고 힌트가 있으면 refresh 쿠키(HttpOnly라 볼 수 없다)가 남았을 수 있어 `/csrf`로 복구한 뒤 확인한다.
 * - 401(갱신까지 실패)은 "세션 없음"이라는 이 엔드포인트의 정상 응답이므로 anonymous. 그 외 실패는 판정 불가라 던진다.
 */
export default async function fetchSession(): Promise<Session> {
  try {
    if (!hasSessionCookie()) {
      if (!useSessionHintStore.getState().userType) return ANONYMOUS_SESSION;
      await webCsrf();
    }

    const { user_type: userType } = await getUserAuth();

    return authenticatedSession(userType);
  } catch (error) {
    if (isKoinError(error) && error.status === 401) return ANONYMOUS_SESSION;
    throw error;
  }
}
