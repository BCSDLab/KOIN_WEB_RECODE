import { create } from 'zustand';

interface State {
  isAuthenticated: boolean;
}

interface Action {
  action: {
    updateAuthentication: (isAuthenticated: State['isAuthenticated']) => void;
  };
}

const useAuthenticationStore = create<State & Action>((set) => ({
  isAuthenticated: false,
  action: {
    updateAuthentication: (isAuthenticated: boolean) => set({ isAuthenticated }),
  },
}));

export const useAuthentication = () => useAuthenticationStore((state) => state.isAuthenticated);

export const useAuthenticationActions = () => useAuthenticationStore((state) => state.action);
