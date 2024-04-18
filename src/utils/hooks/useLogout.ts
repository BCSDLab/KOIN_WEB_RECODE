import { deleteCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand';

export const useLogout = () => {
  const { setToken, setRefreshToken } = useTokenStore();
  const logout = () => {
    setRefreshToken('');
    deleteCookie('AUTH_TOKEN_KEY');
    setToken('');
  };
  return logout;
};
