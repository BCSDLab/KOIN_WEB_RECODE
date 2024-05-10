import { create } from 'zustand';

type State = {
  isAuthenticated: boolean;
};

type Action = {
  action: {
    updateAuthentication: (isAuthenticated: State['isAuthenticated']) => void;
  }
};

const useAuthenticationStore = create<State & Action>((set) => ({
  isAuthenticated: false,
  action: {
    updateAuthentication: (isAuthenticated: boolean) => set({ isAuthenticated }),
  },
}));

export const useAuthentication = () => useAuthenticationStore((state) => state.isAuthenticated);

export const useAuthenticationActions = () => useAuthenticationStore((state) => state.action);
