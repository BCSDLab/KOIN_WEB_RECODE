import { COOKIE_KEY } from 'static/url';
import { getCookie } from 'utils/ts/cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'STUDENT' | 'GENERAL';

type State = {
  token: string;
  refreshToken: string;
  userType: UserType;
};

type Actions = {
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserType: (userType: UserType) => void;
};

export const useTokenStore = create(
  persist<State & Actions>(
    (set) => ({
      token: getCookie(COOKIE_KEY.AUTH_TOKEN) || '',
      refreshToken: '',
      userType: (getCookie(COOKIE_KEY.AUTH_USER_TYPE) || null) as UserType,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setUserType: (userType) => set({ userType }),
    }),
    {
      name: 'refresh-token-storage',
      partialize: (state) =>
        ({
          refreshToken: state.refreshToken,
          userType: state.userType,
        }) as State & Actions,
    },
  ),
);
