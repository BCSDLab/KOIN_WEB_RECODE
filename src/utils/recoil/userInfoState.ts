import { atom } from 'recoil';
import { UserResponse } from 'api/auth/entity';

export const userInfoState = atom<UserResponse | null | undefined>({
  key: 'userInfoState',
  default: null,
});
