import { useEffect } from 'react';
import useAuth from './useAuth';

const useAutoLogin = () => {
  const { refreshAccessToken, getRefreshToken } = useAuth();
  const refreshToken = getRefreshToken();

  useEffect(() => {
    const autoLogin = async () => {
      if (!refreshToken) return;
      try {
        await refreshAccessToken(refreshToken);
      } catch (error) {
        console.error('[useAutoLogin] Failed to refresh access token:', error);
      }
    };

    void autoLogin();
  }, [refreshAccessToken, refreshToken]);
};

export default useAutoLogin;
