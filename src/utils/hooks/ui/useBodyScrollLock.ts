import { useEffect } from 'react';

export const useBodyScrollLock = (shouldLockScroll = true) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : originalStyle;

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [shouldLockScroll]);
};
