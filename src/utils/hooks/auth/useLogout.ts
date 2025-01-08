import { deleteCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';
import ROUTES from 'static/routes';

export const useLogout = () => {
  const { setToken, setRefreshToken } = useTokenStore();
  const logout = () => {
    setRefreshToken('');
    deleteCookie('AUTH_TOKEN_KEY');
    setToken('');
    window.location.href = ROUTES.Main();
  };
  return logout;
};
