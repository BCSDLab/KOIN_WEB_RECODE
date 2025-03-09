import { useState, useRef, useLayoutEffect } from 'react';

type UseScrollLockReturn = {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
};

type OriginalStyle = {
  overflow: CSSStyleDeclaration['overflow'];
  paddingRight: CSSStyleDeclaration['paddingRight'];
};

export function useScrollLock(autoLock: boolean = true): UseScrollLockReturn {
  const [isLocked, setIsLocked] = useState(false);
  const originalStyle = useRef<OriginalStyle | null>(null);

  const lock = () => {
    if (document.body) {
      const { overflow, paddingRight } = document.body.style;

      originalStyle.current = { overflow, paddingRight };

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      document.body.style.overflow = 'hidden';
      setIsLocked(true);
    }
  };

  const unlock = () => {
    if (document.body && originalStyle.current) {
      document.body.style.overflow = originalStyle.current.overflow;
      document.body.style.paddingRight = originalStyle.current.paddingRight;
    }
    setIsLocked(false);
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    if (autoLock) {
      lock();
    }

    // eslint-disable-next-line consistent-return
    return () => unlock();
  }, [autoLock]);

  return { isLocked, lock, unlock };
}
