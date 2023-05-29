import { auth } from 'api';
import { atom, selector } from 'recoil';
import { getCookie } from 'utils/ts/cookie';

// string | null 로 바꿔야 할 듯
// 다만 시간표 쪽 로직에 정의된 타입이 String 고정이라 어느 관심사에서 처리할지 고민해봐야 함
export type TokenState = string;

// token을 유지하는 atom
export const tokenState = atom<TokenState>({
  key: 'tokenState',
  default: getCookie('AUTH_TOKEN_KEY'),
});

export const tokenStateQuery = selector<TokenState>({
  key: 'tokenStateQuery',
  get: async ({ get }) => {
    const token = get(tokenState);
    if (token) {
      return token;
    }
    const refreshToken = localStorage.getItem('AUTH_REFRESH_TOKEN_KEY');
    if (refreshToken) {
      const { token: accessToken } = await auth.refresh({ refresh_token: refreshToken });
      return accessToken;
    }
    return '';
  },
});
