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
  const [isLocked, setIsLocked] = useState(autoLock);
  const originalStyle = useRef<OriginalStyle | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const body = document.body;
    if (!body) return;

    if (isLocked) {
      const { overflow, paddingRight } = body.style;
      originalStyle.current = { overflow, paddingRight };

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.paddingRight = `${scrollbarWidth}px`;
      body.style.overflow = 'hidden';
    }

    return () => {
      if (originalStyle.current) {
        body.style.overflow = originalStyle.current.overflow;
        body.style.paddingRight = originalStyle.current.paddingRight;
        originalStyle.current = null;
      }
    };
  }, [isLocked]);

  const lock = () => setIsLocked(true);
  const unlock = () => setIsLocked(false);

  return { isLocked, lock, unlock };
}
