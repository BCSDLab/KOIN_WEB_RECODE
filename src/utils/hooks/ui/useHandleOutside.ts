import React, { useEffect } from 'react';

interface UseOutsideClickProps<
  Container extends HTMLElement = HTMLElement,
  Background extends HTMLElement = HTMLElement,
> {
  containerRef: React.RefObject<Container | null>;
  backgroundRef: React.RefObject<Background | null>;
  onOutsideClick: (e: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
}

export default function useHandleOutside<
  Container extends HTMLElement = HTMLElement,
  Background extends HTMLElement = HTMLElement,
>({ containerRef, backgroundRef, onOutsideClick, enabled = true }: UseOutsideClickProps<Container, Background>) {
  useEffect(() => {
    if (!enabled) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (!(e.target instanceof Node)) return;

      const target = e.target;
      const container = containerRef.current;
      const background = backgroundRef.current;

      // backdrop 자체를 눌렀을 때 닫기
      if (background && target === background) {
        onOutsideClick(e);
        return;
      }

      // modal 영역 밖을 눌렀을 때 닫기
      if (container && !container.contains(target)) {
        onOutsideClick(e);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchend', handleOutsideClick);
    };
  }, [enabled, containerRef, backgroundRef, onOutsideClick]);
}
