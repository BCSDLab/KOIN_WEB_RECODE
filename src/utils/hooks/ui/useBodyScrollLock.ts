import { useEffect, useState } from 'react';

export const useBodyScrollLock = (lockScroll?: boolean) => {
  const [isLocked, setIsLocked] = useState(lockScroll ?? true);

  useEffect(() => {
    if (typeof lockScroll !== 'undefined') {
      setIsLocked(lockScroll);
    }
  }, [lockScroll]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);

  return [isLocked, setIsLocked] as const;
};
