import { useRef, useCallback, useEffect } from 'react';

export function useDebounce<T extends (
  ...args: any[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedCallback = useRef<T>(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const debounced = useCallback((...args: Parameters<T>) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      savedCallback.current(...args);
    }, delay);
  }, [delay]);

  useEffect(() => () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  return debounced;
}
