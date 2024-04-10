import { create } from 'zustand';
// eslint-disable-next-line import/extensions
import { persist } from 'zustand/middleware';
import { getCookie, setCookie } from 'utils/ts/cookie';
import { auth } from 'api';

type State = {
  token: string;
  refreshToken: string;
};

type Actions = {
  refreshAccessToken: () => Promise<void>;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

export const useTokenStore = create(
  persist<State & Actions>(
    (set, get) => ({
      token: getCookie('AUTH_TOKEN_KEY') || '',
      refreshToken: '',

      refreshAccessToken: async () => {
        const { token, refreshToken } = get();

        if (token) {
          set({ token });
        } else if (refreshToken) {
          const result = await auth.refresh({ refresh_token: refreshToken });
          const { token: newAccessToken, refresh_token: newRefreshToken } = result;
          setCookie('AUTH_TOKEN_KEY', newAccessToken, 3);
          set({ token: newAccessToken, refreshToken: newRefreshToken });
        } else {
          set({ token: '' });
        }
      },
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
    }),
    {
      name: 'refresh-token-storage',
      partialize: (state) => ({ refreshToken: state.refreshToken }) as State & Actions,
    },
  ),
);
