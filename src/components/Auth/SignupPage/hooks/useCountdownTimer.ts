import { useEffect, useRef, useState } from 'react';

interface CountdownTimerOptions {
  duration: number;
  onExpire?: () => void;
}

function useCountdownTimer({ duration, onExpire }: CountdownTimerOptions) {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    clearInterval(intervalRef.current!);
    setSecondsLeft(duration);
    setIsRunning(true);
  };

  const stop = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setSecondsLeft(0);
  };

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, secondsLeft, onExpire]);

  return {
    isRunning,
    secondsLeft,
    start,
    stop,
  };
}

export default useCountdownTimer;
