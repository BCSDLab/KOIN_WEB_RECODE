import { create } from 'zustand';

interface HeaderButtonState {
  buttonContent: JSX.Element | null;
  setButtonContent: (content: JSX.Element | null) => void;
}

const useHeaderButtonStore = create<HeaderButtonState>((set) => ({
  buttonContent: null,
  setButtonContent: (content) => set({ buttonContent: content }),
}));

export const useHeaderButton = () => {
  const { buttonContent, setButtonContent } = useHeaderButtonStore();

  const HeaderButton = () => buttonContent;

  return {
    HeaderButton,
    setButtonContent,
  };
};
