import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  enabled?: boolean;
}

const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
  options: UseInfiniteScrollOptions = {},
) => {
  const { threshold = 0.3, enabled = true } = options;
  const observerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold },
    );

    const currentElement = observerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return observerRef;
};

export default useInfiniteScroll;
