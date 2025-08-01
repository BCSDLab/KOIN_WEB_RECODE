import { useEffect } from 'react';
import useAuth from './useAuth';

const useAutoLogin = () => {
  const { mutateAsync: refreshAccessToken } = useAuth();
  const refreshTokenStorage = localStorage.getItem('refresh-token-storage');
  const refreshToken = refreshTokenStorage
    ? JSON.parse(refreshTokenStorage).state.refreshToken
    : undefined;

  useEffect(() => {
    const autoLogin = async () => {
      if (!refreshToken) return;
      await refreshAccessToken({ refresh_token: refreshToken });
    };

    autoLogin();
  }, [refreshAccessToken, refreshToken]);
};

export default useAutoLogin;
