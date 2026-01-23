import { useCallback, useEffect, useRef } from 'react';

const PROGRAMMATIC_SCROLL_THRESHOLD = 100;

interface UseScrollPickerOptions {
  itemHeight: number;
  debounceMs?: number;
}

export function useScrollPicker({ itemHeight, debounceMs = 100 }: UseScrollPickerOptions) {
  const lastProgrammaticScrollTime = useRef(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const syncScrollPosition = useCallback(
    <T>(ref: React.RefObject<HTMLDivElement | null>, items: T[], currentValue: T) => {
      lastProgrammaticScrollTime.current = Date.now();

      const index = items.indexOf(currentValue);
      const targetIndex = index >= 0 ? index : items.length - 1;

      if (ref.current) {
        ref.current.scrollTop = targetIndex * itemHeight;
      }
    },
    [itemHeight],
  );

  const createScrollHandler =
    <T>(items: T[], currentValue: T, onValueChange: (value: T) => void, getElement: () => HTMLDivElement | null) =>
    () => {
      if (Date.now() - lastProgrammaticScrollTime.current < PROGRAMMATIC_SCROLL_THRESHOLD) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const element = getElement();
        if (!element) return;

        const { scrollTop } = element;
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
        const value = items[clampedIndex];

        if (value !== undefined && value !== currentValue) {
          onValueChange(value);
        }
      }, debounceMs);
    };

  return {
    syncScrollPosition,
    createScrollHandler,
  };
}
