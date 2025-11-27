import ROUTES from 'static/routes';
import { deleteCookie, getCookieDomain } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';
import { STORAGE_KEY } from 'static/auth';

export const useLogout = () => {
  const { setToken, setRefreshToken } = useTokenStore();
  const logout = () => {
    const domain = getCookieDomain();

    setRefreshToken('');
    deleteCookie('AUTH_TOKEN_KEY', { domain });
    sessionStorage.removeItem(STORAGE_KEY.MODAL_SESSION_SHOWN);
    setToken('');
    window.location.href = ROUTES.Main();
  };
  return logout;
};
