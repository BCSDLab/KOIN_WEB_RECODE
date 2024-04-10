import { deleteCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand';

export const useLogout = () => {
  const { setToken } = useTokenStore();
  const logout = () => {
    localStorage.removeItem('AUTH_REFRESH_TOKEN_KEY');
    deleteCookie('AUTH_TOKEN_KEY');
    setToken('');
  };
  return logout;
};
