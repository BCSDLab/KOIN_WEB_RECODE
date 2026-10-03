import { redirectToLogin } from 'utils/ts/auth';
import { queryClient } from 'utils/ts/queryClient';

import { ANONYMOUS_SESSION, authenticatedSession, SESSION_QUERY_KEY, type Session, type UserType } from './session';

// apiClient가 세션 변화를 알리는 통로. 이동 여부 같은 정책은 여기서 정한다.
export function markSessionAuthenticated(userType: UserType) {
  queryClient.setQueryData(SESSION_QUERY_KEY, authenticatedSession(userType));
}

// 세션을 먼저 anonymous로 바꿔 소비 쪽이 에러 없이 비로그인으로 다시 그리게 한다.
// authOptional 요청은 비로그인도 정상이므로 로그인 화면으로 보내지 않는다.
// 로그인이었던 세션이 끝나면 사용자별 캐시를 비운다. 뷰어 스코프 키는 auth/guest 둘뿐이라, 다른 탭에서 계정이 바뀐 뒤
// 복구되면 이전 계정의 캐시를 그대로 볼 수 있다. 이미 비로그인이던 세션에는 비울 사용자 데이터가 없다.
export function markSessionExpired({ authOptional }: { authOptional?: boolean }) {
  const wasAuthenticated = queryClient.getQueryData<Session>(SESSION_QUERY_KEY)?.status === 'authenticated';
  if (wasAuthenticated) queryClient.clear();
  queryClient.setQueryData(SESSION_QUERY_KEY, ANONYMOUS_SESSION);
  if (!authOptional && typeof window !== 'undefined') redirectToLogin();
}
