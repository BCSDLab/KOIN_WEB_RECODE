import { useCallback, useEffect, useRef, useState } from 'react';

// KOIN_ORDER_WEBVIEW util/hooks/useTimer 이전(인증번호 유효시간). 만료 시각 기준으로 남은 초를 센다
export default function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const expiresAtRef = useRef<number | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const clearTick = useCallback(() => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!expiresAtRef.current) return;

    const remain = Math.max(0, Math.ceil((expiresAtRef.current - Date.now()) / 1000));
    setSeconds(remain);

    if (remain === 0) {
      expiresAtRef.current = null;
      clearTick();
    }
  }, [clearTick]);

  const start = useCallback(
    (durationSeconds: number) => {
      expiresAtRef.current = Date.now() + durationSeconds * 1000;
      setSeconds(durationSeconds);
      if (intervalIdRef.current === null) {
        intervalIdRef.current = window.setInterval(tick, 1000);
      }
      tick();
    },
    [tick],
  );

  const reset = useCallback(() => {
    expiresAtRef.current = null;
    setSeconds(0);
    clearTick();
  }, [clearTick]);

  useEffect(() => clearTick, [clearTick]);

  return { seconds, start, reset };
}
