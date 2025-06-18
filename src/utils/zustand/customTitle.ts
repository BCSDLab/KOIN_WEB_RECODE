import { create } from 'zustand';

interface HeaderTitleState {
  customTitle: string;
  setCustomTitle: (t: string) => void;
  resetCustomTitle: () => void;
}

export const useHeaderTitle = create<HeaderTitleState>((set) => ({
  customTitle: '',
  setCustomTitle: (t) => set({ customTitle: t }),
  resetCustomTitle: () => set({ customTitle: '' }),
}));
