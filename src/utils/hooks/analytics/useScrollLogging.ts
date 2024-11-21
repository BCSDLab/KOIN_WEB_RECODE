import { useEffect, useRef, useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

export const useScrollLogging = (loggingFunc: () => void, targetPercent = 0.7) => {
  const [currentHeight, setCurrentHeight] = useState<number>(window.scrollY);
  const id = useRef<null | NodeJS.Timeout>(null);
  const debounce = (func: () => void) => {
    if (id.current) clearTimeout(id.current);
    id.current = setTimeout(func, 200);
  };
  const isMobile = useMediaQuery();
  useEffect(() => {
    const onScroll = () => debounce(() => {
      if (document.body.scrollHeight * targetPercent > window.scrollY) {
        setCurrentHeight(window.scrollY);
      }
    });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', () => setCurrentHeight(window.scrollY));

    if ((document.body.scrollHeight - window.innerHeight) * targetPercent < currentHeight) {
      loggingFunc();
    }
    return () => window.removeEventListener('scroll', onScroll); // 웹 사이트 높이의 70퍼센트를 넘을 때 로깅
  }, [currentHeight, loggingFunc, isMobile, targetPercent]);
};
