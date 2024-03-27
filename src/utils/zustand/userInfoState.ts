import { create } from 'zustand';
import { UserResponse } from 'api/auth/entity';

interface UserInfoStore {
  userInfo: UserResponse | null | undefined;
  setUserInfo: (userInfo: UserResponse | null | undefined) => void;
}

export const useUserStore = create<UserInfoStore>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
}));
