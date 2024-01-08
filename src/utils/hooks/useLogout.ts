import { useRecoilState } from 'recoil';
import { tokenState } from 'utils/recoil';
import { deleteCookie } from 'utils/ts/cookie';

export const useLogout = () => {
  const [, setToken] = useRecoilState(tokenState);
  const logout = () => {
    localStorage.removeItem('AUTH_REFRESH_TOKEN_KEY');
    deleteCookie('AUTH_TOKEN_KEY');
    setToken('');
  };
  return logout;
};
