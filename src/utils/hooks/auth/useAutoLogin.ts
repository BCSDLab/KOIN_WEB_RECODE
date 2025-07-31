import { useEffect } from 'react';
import { Refresh } from 'api/auth/APIDetail';
import APIClient from 'utils/ts/apiClient';
import { setCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

export function useAutoLogin() {
  useEffect(() => {
    const autoLogin = async () => {
      const { refreshToken, setToken, setRefreshToken } = useTokenStore.getState();
      if (!refreshToken) return;

      try {
        const response = await APIClient.request(new Refresh({ refresh_token: refreshToken }));
        setToken(response.token);
        setCookie('AUTH_TOKEN_KEY', response.token);
      } catch (e) {
        setToken('');
        setRefreshToken('');
      }
    };

    autoLogin();
  }, []);
}
