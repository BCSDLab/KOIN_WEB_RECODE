import { redirectToLogin } from 'utils/ts/auth';
import { queryClient } from 'utils/ts/queryClient';

import { ANONYMOUS_SESSION, authenticatedSession, SESSION_QUERY_KEY, type UserType } from './session';

/**
 * apiClient가 세션 변화를 알리는 유일한 통로. apiClient는 캐시를 비우거나 이동하지 않고 사실만 전달하며,
 * 정책(이동 여부)은 여기서 정한다.
 */
export function markSessionAuthenticated(userType: UserType) {
  queryClient.setQueryData(SESSION_QUERY_KEY, authenticatedSession(userType));
}

/**
 * 갱신까지 실패해 세션이 끝났다. anonymous로 먼저 뒤집어 소비 쪽이 에러 없이 비로그인으로 다시 그리게 한다.
 * `authOptional` 요청(세션·사용자 정보)은 비로그인도 정상이므로 로그인 화면으로 보내지 않는다.
 */
export function markSessionExpired({ authOptional }: { authOptional?: boolean }) {
  queryClient.setQueryData(SESSION_QUERY_KEY, ANONYMOUS_SESSION);
  if (!authOptional && typeof window !== 'undefined') redirectToLogin();
}
