import { useQueryClient } from '@tanstack/react-query';
import { webLogout } from 'api/auth';
import { STORAGE_KEY } from 'static/auth';
import ROUTES from 'static/routes';
import { isomorphicSessionStorage } from 'utils/ts/env';
import { useTokenStore } from 'utils/zustand/auth';

export const useLogout = () => {
  const { setUserType } = useTokenStore();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await webLogout();
    } catch {
      // 세션이 이미 만료된 경우 등 — 서버 로그아웃이 실패해도 화면의 로그인 상태는 비운다.
    }
    isomorphicSessionStorage.removeItem(STORAGE_KEY.MODAL_SESSION_SHOWN);
    setUserType(null);
    queryClient.clear();
    window.location.href = ROUTES.Main();
  };

  return logout;
};
