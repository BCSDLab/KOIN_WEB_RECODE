import { STORAGE_KEY } from 'static/auth';
import ROUTES from 'static/routes';
import { deleteCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

const getCookieDomain = () => {
  if (typeof window === 'undefined') return undefined;

  const { hostname } = window.location;
  if (hostname === 'localhost') return undefined;

  if (process.env.NEXT_PUBLIC_API_PATH?.includes('stage')) {
    return '.stage.koreatech.in';
  }

  return '.koreatech.in';
};

export const useLogout = () => {
  const { setToken, setRefreshToken } = useTokenStore();
  const logout = () => {
    const domain = getCookieDomain();

    setRefreshToken('');
    deleteCookie('AUTH_TOKEN_KEY', { domain: domain });
    sessionStorage.removeItem(STORAGE_KEY.MODAL_SESSION_SHOWN);
    setToken('');
    window.location.href = ROUTES.Main();
  };
  return logout;
};
