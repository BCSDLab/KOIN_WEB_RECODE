import { COOKIE_KEY } from 'static/url';
import { getCookie } from 'utils/ts/cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'STUDENT' | 'GENERAL';

// 쿠키·serverRequest 등 어디서 왔는지 신뢰할 수 없는 원문 문자열을 UserType으로 좁힌다.
// 값이 STUDENT/GENERAL이 아니면(로그인 전, 알 수 없는 값 등) null로 취급한다 — ''을 별도
// "알 수 없음" 상태로 쓰지 않고 null 하나로 통일해 소비하는 쪽의 분기를 단순하게 만든다.
export const parseUserType = (value: string | null | undefined): UserType | null =>
  value === 'STUDENT' || value === 'GENERAL' ? value : null;

interface State {
  token: string;
  refreshToken: string;
  userType: UserType | null;
}

interface Actions {
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserType: (userType: UserType | null) => void;
}

export const useTokenStore = create(
  persist<State & Actions>(
    (set) => ({
      token: getCookie(COOKIE_KEY.AUTH_TOKEN) || '',
      refreshToken: '',
      userType: parseUserType(getCookie(COOKIE_KEY.AUTH_USER_TYPE)),
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
