import { useQueryClient } from '@tanstack/react-query';
import { getWebSession, webLogout } from 'api/auth';
import { STORAGE_KEY } from 'static/auth';
import ROUTES from 'static/routes';
import { ANONYMOUS_SESSION, hasSessionCookie, SESSION_QUERY_KEY } from 'utils/auth/session';
import { isomorphicSessionStorage } from 'utils/ts/env';

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // 로그아웃은 X-CSRF-Token이 필수라, CSRF 쿠키만 사라진 경우 세션 조회로 먼저 복구한다.
      if (!hasSessionCookie()) await getWebSession();
      await webLogout();
    } catch {
      // 세션이 이미 만료된 경우 등 — 서버 로그아웃이 실패해도 화면의 로그인 상태는 비운다.
    }
    isomorphicSessionStorage.removeItem(STORAGE_KEY.MODAL_SESSION_SHOWN);
    queryClient.clear();
    queryClient.setQueryData(SESSION_QUERY_KEY, ANONYMOUS_SESSION);
    window.location.href = ROUTES.Main();
  };

  return logout;
};
