import { useRef } from 'react';

/**
 * 페이지 내에서 특정 요소로 스크롤 이동
 * @return {elements, onMoveToElement}
 *  - elements: 이동할 요소들의 배열
 *  - onMoveToElement: 인덱스에 해당하는 요소로 이동
 */
export default function useMoveScroll() {
  const elements = useRef<Array<HTMLDivElement | null>>([]);

  const onMoveToElement = (index: number) => {
    if (elements.current[index]) {
      elements.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { elements, onMoveToElement };
}
