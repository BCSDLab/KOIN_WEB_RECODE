import { useEffect } from 'react';
import useAuth from './useAuth';

const useAutoLogin = () => {
  const { refreshAccessToken, getRefreshToken } = useAuth();
  const refreshToken = getRefreshToken();

  useEffect(() => {
    const autoLogin = async () => {
      if (!refreshToken) return;
      await refreshAccessToken(refreshToken);
    };

    autoLogin();
  }, [refreshAccessToken, refreshToken]);
};

export default useAutoLogin;
