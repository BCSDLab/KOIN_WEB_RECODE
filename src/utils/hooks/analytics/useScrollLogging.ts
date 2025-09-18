import { useEffect, useRef } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

export const useScrollLogging = (
  loggingFunc: () => void,
  targetPercent = 0.7,
) => {
  const loggedRef = useRef(false); // 이미 로깅했는지 여부
  const isMobile = useMediaQuery();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined; // SSR 방어

    const onScroll = () => {
      if (loggedRef.current) return; // 이미 로깅했으면 무시

      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const threshold = docHeight * targetPercent;

      if (scrollTop >= threshold) {
        loggingFunc();
        loggedRef.current = true; // 다시는 호출 안 됨
      }
    };

    window.addEventListener('scroll', onScroll);

    // 혹시 이미 스크롤된 상태라면 즉시 체크
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [loggingFunc, targetPercent, isMobile]);
};
