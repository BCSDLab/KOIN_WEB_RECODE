import { create } from 'zustand';
import { getCookie, setCookie } from 'utils/ts/cookie';
import { auth } from 'api';

type State = {
  token: string;
  refreshToken: string;
};

type Actions = {
  refreshAccessToken: () => Promise<void>;
  setToken: (token: string) => void;
};

export const useTokenStore = create<State & Actions>((set, get) => ({
  token: getCookie('AUTH_TOKEN_KEY') || '',
  refreshToken: localStorage.getItem('AUTH_REFRESH_TOKEN_KEY') || '',

  refreshAccessToken: async () => {
    const { token, refreshToken } = get();

    if (token) {
      set({ token });
    } else if (refreshToken) {
      const result = await auth.refresh({ refresh_token: refreshToken });
      const { token: newAccessToken, refresh_token: newRefreshToken } = result;
      setCookie('AUTH_TOKEN_KEY', newAccessToken, 3);
      localStorage.setItem('AUTH_REFRESH_TOKEN_KEY', newRefreshToken);
      set({ token: newAccessToken, refreshToken: newRefreshToken });
    } else {
      set({ token: '' });
    }
  },
  setToken: (token) => set({ token }),
}));
