import { useEffect, useRef, useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

export const useScorllLogging = (loggingFunc: () => void, targetPercent = 0.7) => {
  const [currentHeignt, setCurrentHeight] = useState<number>(window.scrollY);
  const id = useRef<null | NodeJS.Timeout>(null);
  const debounce = (func: () => void) => {
    if (id.current) clearTimeout(id.current);
    id.current = setTimeout(func, 200);
  };
  const isMoblie = useMediaQuery();

  useEffect(() => {
    const onScroll = () => debounce(() => setCurrentHeight(window.scrollY));
    if (document.body.scrollHeight * targetPercent > currentHeignt) {
      window.addEventListener('scroll', onScroll);
    }
    if ((document.body.scrollHeight - window.innerHeight) * targetPercent < currentHeignt) {
      loggingFunc();
    }
    return () => window.removeEventListener('scroll', onScroll); // 웹 사이트 높이의 70퍼센트를 넘을 때 로깅
  }, [currentHeignt, loggingFunc, isMoblie, targetPercent]);
};
