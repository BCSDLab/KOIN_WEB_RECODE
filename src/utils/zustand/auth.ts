import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCookie } from 'utils/ts/cookie';

export type UserType = 'STUDENT' | 'GENERAL' | null;

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
      token: getCookie('AUTH_TOKEN_KEY') || '',
      refreshToken: '',
      userType: (getCookie('AUTH_USER_TYPE') || null) as UserType,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setUserType: (userType) => set({ userType }),
    }),
    {
      name: 'refresh-token-storage',
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        userType: state.userType,
      }) as State & Actions,
    },
  ),
);
