import { redirectToLogin } from 'utils/ts/auth';
import { queryClient } from 'utils/ts/queryClient';

import { ANONYMOUS_SESSION, authenticatedSession, SESSION_QUERY_KEY, type UserType } from './session';

// apiClient가 세션 변화를 알리는 통로. 이동 여부 같은 정책은 여기서 정한다.
export function markSessionAuthenticated(userType: UserType) {
  queryClient.setQueryData(SESSION_QUERY_KEY, authenticatedSession(userType));
}

// 세션을 먼저 anonymous로 바꿔 소비 쪽이 에러 없이 비로그인으로 다시 그리게 한다.
// authOptional 요청은 비로그인도 정상이므로 로그인 화면으로 보내지 않는다.
export function markSessionExpired({ authOptional }: { authOptional?: boolean }) {
  queryClient.setQueryData(SESSION_QUERY_KEY, ANONYMOUS_SESSION);
  if (!authOptional && typeof window !== 'undefined') redirectToLogin();
}
