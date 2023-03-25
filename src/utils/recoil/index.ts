import { atom } from 'recoil';
import { getCookie } from 'utils/ts/cookie';

export interface ITokenType {
  token: string;
}

// token을 유지하는 atom
export const tokenState = atom<string>({
  key: 'tokenState',
  default: getCookie('AUTH_TOKEN_KEY'),
});
