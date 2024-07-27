import { useEffect, useRef } from 'react';

interface UseCloseOptions {
  closeFunction: () => void;
  enableEscKey?: boolean;
  enableOutsideClick?: boolean;
}

export const useClose = ({
  closeFunction,
  enableEscKey = true,
  enableOutsideClick = true,
}: UseCloseOptions) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKeyDown = (e: KeyboardEvent) => {
      if (enableEscKey && e.key === 'Escape') closeFunction();
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (enableOutsideClick && e.target === backgroundRef.current) closeFunction();
    };

    if (enableEscKey) {
      window.addEventListener('keydown', handleEscKeyDown);
    }

    if (enableOutsideClick) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      if (enableEscKey) {
        window.removeEventListener('keydown', handleEscKeyDown);
      }
      if (enableOutsideClick) {
        window.removeEventListener('click', handleOutsideClick);
      }
    };
  }, [closeFunction, enableEscKey, enableOutsideClick]);

  return { backgroundRef };
};
