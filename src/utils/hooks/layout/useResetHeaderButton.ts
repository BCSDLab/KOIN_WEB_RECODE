import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';

export function useResetHeaderButton() {
  const router = useRouter();
  const location = router.asPath || router.pathname;
  const resetButtonContent = useHeaderButtonStore((state) => state.resetButtonContent);

  useEffect(() => {
    resetButtonContent();
  }, [location, resetButtonContent]);
}
