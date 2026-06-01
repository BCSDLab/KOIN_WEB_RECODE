import { useEffect } from 'react';
import useAuth from './useAuth';

const useAutoLogin = () => {
  const { refreshAccessToken, getRefreshToken } = useAuth();

  useEffect(() => {
    const autoLogin = async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return;
      try {
        await refreshAccessToken(refreshToken);
      } catch (error) {
        console.error('[useAutoLogin] Failed to refresh access token:', error);
      }
    };

    void autoLogin();
  }, [refreshAccessToken, getRefreshToken]);
};

export default useAutoLogin;
