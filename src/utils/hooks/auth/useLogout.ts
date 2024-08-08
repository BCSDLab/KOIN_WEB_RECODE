import { deleteCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

export const useLogout = () => {
  const { setToken, setRefreshToken } = useTokenStore();
  const logout = () => {
    setRefreshToken('');
    deleteCookie('AUTH_TOKEN_KEY');
    setToken('');
    window.location.href = '/';
  };
  return logout;
};
