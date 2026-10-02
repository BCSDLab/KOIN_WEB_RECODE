import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserType } from './session';

interface State {
  userType: UserType | null;
}

interface Actions {
  setUserType: (userType: UserType | null) => void;
}

/**
 * 이 브라우저에서 마지막으로 확인된 회원 유형. 권위 있는 값이 아니라 두 가지 용도의 **힌트**다.
 * - 세션 확인 전에 로그인 화면을 임시로 유지한다.
 * - 세션 쿠키가 없을 때 refresh만 남았을 가능성이 있는지(복구를 시도할지) 판단한다.
 * 확인된 세션이 항상 이 값을 덮어쓴다(`useSyncSessionHint`).
 */
export const useSessionHintStore = create(
  persist<State & Actions>(
    (set) => ({
      userType: null,
      setUserType: (userType) => set({ userType }),
    }),
    {
      // 기존 키를 유지한다: 네이티브 앱이 이 키를 심고 있어도 힌트로 계속 동작한다.
      name: 'refresh-token-storage',
    },
  ),
);
