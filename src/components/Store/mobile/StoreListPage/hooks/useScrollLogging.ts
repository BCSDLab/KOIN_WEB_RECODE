import { useEffect, useRef } from 'react';

// KOIN_ORDER_WEBVIEW util/hooks/analytics/useScrollLogging 이전.
// 공용 useScrollLogging(70% 지점 1회)과 기준이 달라, order 이벤트 수를 유지하려고 화면 전용으로 둔다
interface ScrollLoggingOptions {
  throttleMilliseconds?: number;
  minimumDeltaPixels?: number;
}

export default function useScrollLogging(loggingFunc: () => void, options: ScrollLoggingOptions = {}) {
  const { throttleMilliseconds = 800, minimumDeltaPixels = 8 } = options;

  const lastLoggedTimestampRef = useRef(0);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const scrollElement = document.scrollingElement || document.documentElement;
    lastScrollTopRef.current = scrollElement?.scrollTop ?? 0;

    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollTop = scrollElement?.scrollTop ?? 0;
      const scrolledDistance = Math.abs(currentScrollTop - lastScrollTopRef.current);

      const isBeyondMinimumDistance = scrolledDistance >= minimumDeltaPixels;
      const isBeyondThrottleTime = currentTime - lastLoggedTimestampRef.current >= throttleMilliseconds;

      if (isBeyondMinimumDistance && isBeyondThrottleTime) {
        lastLoggedTimestampRef.current = currentTime;
        loggingFunc();
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loggingFunc, throttleMilliseconds, minimumDeltaPixels]);
}
