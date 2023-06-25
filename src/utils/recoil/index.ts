import { auth } from 'api';
import { atom, selector } from 'recoil';
import { getCookie, setCookie } from 'utils/ts/cookie';

// string | null 로 바꿔야 할 듯
// 다만 시간표 쪽 로직에 정의된 타입이 String 고정이라 어느 관심사에서 처리할지 고민해봐야 함
export type TokenState = string;

// token을 유지하는 atom
export const tokenState = atom<TokenState>({
  key: 'tokenState',
  default: selector({
    key: 'tokenState/Default',
    get: async () => {
      const token = getCookie('AUTH_TOKEN_KEY');
      if (token) {
        return token;
      }

      const refreshToken = localStorage.getItem('AUTH_REFRESH_TOKEN_KEY');
      if (refreshToken) {
        const result = await auth.refresh({ refresh_token: refreshToken });
        const { token: newAccessToken, refresh_token: newRefreshToken } = result;
        setCookie('AUTH_TOKEN_KEY', newAccessToken, 3);
        localStorage.setItem('AUTH_REFRESH_TOKEN_KEY', newRefreshToken);
        return newAccessToken;
      }
      return '';
    },
  }),
});
