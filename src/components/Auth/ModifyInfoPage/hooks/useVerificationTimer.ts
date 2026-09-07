import { useEffect, useRef, useState } from 'react';

interface UseVerificationTimer {
  timeLeft: number;
  formattedTime: string;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  expire: () => void;
}

export function useVerificationTimer(initialDuration: number = 180, onExpire?: () => void): UseVerificationTimer {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const timeLeftRef = useRef(initialDuration);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      const next = Math.max(timeLeftRef.current - 1, 0);

      timeLeftRef.current = next;
      setTimeLeft(next);

      if (next > 0) return;

      clearInterval(interval);
      setIsRunning(false);
      onExpireRef.current?.();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    timeLeftRef.current = initialDuration;
    setTimeLeft(initialDuration);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    timeLeftRef.current = initialDuration;
    setTimeLeft(initialDuration);
  };

  const expire = () => {
    timeLeftRef.current = 0;
    setTimeLeft(0);

    if (!isRunning) return;

    setIsRunning(false);
    onExpireRef.current?.();
  };

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

  return {
    timeLeft,
    formattedTime,
    isRunning,
    start,
    stop,
    reset,
    expire,
  };
}
