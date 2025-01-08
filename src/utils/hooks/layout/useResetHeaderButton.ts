import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';

export function useResetHeaderButton() {
  const location = useLocation();
  const resetButtonContent = useHeaderButtonStore((state) => state.resetButtonContent);

  useEffect(() => {
    resetButtonContent();
  }, [location, resetButtonContent]);
}
