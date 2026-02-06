import { STORAGE_KEY } from 'static/auth';
import ROUTES from 'static/routes';
import { COOKIE_KEY } from 'static/url';
import { deleteCookie, getCookieDomain } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

export const useLogout = () => {
  const { setToken, setRefreshToken } = useTokenStore();
  const logout = () => {
    const domain = getCookieDomain();

    setRefreshToken('');
    deleteCookie(COOKIE_KEY.AUTH_TOKEN); // 배포 후 기존 도메인 없는 쿠키들의 하위 호환성을 위해 임시 유지
    deleteCookie(COOKIE_KEY.AUTH_TOKEN, domain ? { domain: domain } : undefined);
    sessionStorage.removeItem(STORAGE_KEY.MODAL_SESSION_SHOWN);
    setToken('');
    window.location.href = ROUTES.Main();
  };
  return logout;
};
