import { Refresh } from 'api/auth/APIDetail';
import APIClient from 'utils/ts/apiClient';
import { setCookie } from 'utils/ts/cookie';
import { useTokenStore } from 'utils/zustand/auth';

export const tryAutoLogin = async () => {
  const { refreshToken } = useTokenStore.getState();
  if (!refreshToken) return;

  try {
    const response = await APIClient.request(new Refresh({ refresh_token: refreshToken }));
    useTokenStore.getState().setToken(response.token);
    setCookie('AUTH_TOKEN_KEY', response.token);
  } catch (e) {
    useTokenStore.getState().setToken('');
    useTokenStore.getState().setRefreshToken('');
  }
};
