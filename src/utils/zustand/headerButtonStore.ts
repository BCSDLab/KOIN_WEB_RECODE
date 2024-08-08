import create from 'zustand';
import { ReactNode } from 'react';

type CustomButtonState =
  | { type: 'custom'; content: ReactNode }
  | { type: 'default'; content: null };

type HeaderStore = {
  buttonState: CustomButtonState;
  setButtonContent: (content: ReactNode) => void;
  resetButtonContent: () => void;
};

export const useHeaderButtonStore = create<HeaderStore>((set) => ({
  buttonState: { type: 'default', content: null },
  setButtonContent: (content) => set({
    buttonState: content
      ? { type: 'custom', content }
      : { type: 'default', content: null },
  }),
  resetButtonContent: () => set({
    buttonState: { type: 'default', content: null },
  }),
}));
