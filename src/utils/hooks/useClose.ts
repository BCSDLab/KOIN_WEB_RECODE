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
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKeyDown = (e: KeyboardEvent) => {
      if (enableEscKey && e.key === 'Escape') closeFunction();
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!enableOutsideClick) return;

      const clickedElement = e.target as Node;
      const container = containerRef.current;
      const background = backgroundRef.current;

      if (container && !container.contains(clickedElement)) {
        closeFunction();
      } else if (background && background === clickedElement) {
        closeFunction();
      }
    };

    if (enableEscKey) {
      window.addEventListener('keydown', handleEscKeyDown);
    }

    if (enableOutsideClick) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      if (enableEscKey) {
        window.removeEventListener('keydown', handleEscKeyDown);
      }
      if (enableOutsideClick) {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
  }, [closeFunction, enableEscKey, enableOutsideClick]);

  return { containerRef, backgroundRef };
};
