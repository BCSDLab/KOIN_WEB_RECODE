import { useRef } from 'react';

export default function useMoveScroll() {
  const elements = useRef<Array<HTMLDivElement | null>>([]);

  const onMoveToElement = (index: number) => {
    if (elements.current[index]) {
      elements.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { elements, onMoveToElement };
}
