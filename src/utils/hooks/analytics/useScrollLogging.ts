import { useEffect, useRef, useState } from 'react';

export const useScorllLogging = (
  loggingFunc: () => void,
) => {
  const [currentHeignt, setCurrentHeight] = useState<number>(window.scrollY);
  const id = useRef<null | NodeJS.Timeout>(null);
  const debounce = (func: () => void) => {
    if (id.current) clearTimeout(id.current);
    id.current = setTimeout(func, 200);
  };

  useEffect(() => {
    const onScroll = () => debounce(() => setCurrentHeight(window.scrollY + window.innerHeight));
    if (document.body.scrollHeight * 0.7 > currentHeignt) {
      window.addEventListener('scroll', onScroll);
    }

    if (document.body.scrollHeight * 0.7 < currentHeignt) {
      loggingFunc();
    }
    return () => window.removeEventListener('scroll', onScroll); // 웹 사이트 높이의 70퍼센트를 넘을 때 로깅
  }, [currentHeignt, loggingFunc]);
};
