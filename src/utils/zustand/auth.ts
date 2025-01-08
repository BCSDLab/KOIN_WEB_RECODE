import { getCookie } from 'utils/ts/cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  token: string;
  refreshToken: string;
};

type Actions = {
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

export const useTokenStore = create(
  persist<State & Actions>(
    (set) => ({
      token: getCookie('AUTH_TOKEN_KEY') || '',
      refreshToken: '',
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
    }),
    {
      name: 'refresh-token-storage',
      partialize: (state) => ({ refreshToken: state.refreshToken }) as State & Actions,
    }
  )
);
