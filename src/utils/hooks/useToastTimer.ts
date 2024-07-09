import {
  useCallback, useEffect, useRef, useState,
} from 'react';

interface ToastTimerProps {
  autoCloseTime: number;
  onClose: () => void;
}

export default function useToastTimer({ autoCloseTime, onClose }: ToastTimerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const remainingTime = useRef<number>(autoCloseTime);
  const startTime = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    startTime.current = Date.now();
    timerId.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, remainingTime.current);
  }, [onClose]);

  const pauseTimer = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    if (startTime.current) {
      const elapsedTime = Date.now() - startTime.current;
      remainingTime.current -= elapsedTime;
    }
    setIsPaused(true);
  };

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  const toastProps = {
    onMouseEnter: pauseTimer,
    onMouseLeave: resumeTimer,
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [startTimer]);

  return [toastProps, isVisible, setIsVisible, isPaused] as const;
}
