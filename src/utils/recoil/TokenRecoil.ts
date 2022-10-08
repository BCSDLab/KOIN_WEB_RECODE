import { atom } from 'recoil';

export interface ITokenType {
  token: string;
}

// token을 유지하는 atom
export const tokenState = atom<string>({
  key: 'tokenState',
  default: '',
});
