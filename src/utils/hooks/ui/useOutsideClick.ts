import { useEffect, useRef } from 'react';

interface UseOutsideClickOptions {
  onOutsideClick: (e: MouseEvent) => void;
}

export const useOutsideClick = <TContainer extends HTMLElement = HTMLDivElement>({
  onOutsideClick,
}: UseOutsideClickOptions) => {
  const containerRef = useRef<TContainer>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const clickedElement = e.target as Node;
      const container = containerRef.current;
      const background = backgroundRef.current;

      if (!container || !background) return;

      if (clickedElement === background) {
        onOutsideClick(e);
        return;
      }

      if (!container.contains(clickedElement)) {
        onOutsideClick(e);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
    };
  }, [onOutsideClick]);

  return { containerRef, backgroundRef };
};
