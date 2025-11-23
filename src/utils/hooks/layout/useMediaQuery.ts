import { useSyncExternalStore } from 'react';

const MOBILE_QUERY = '(max-width: 576px)';

function subscribeToMediaQuery(query: string) {
  return (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {};

    const matchMedia = window.matchMedia(query);
    const handleChange = () => onStoreChange();

    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  };
}

export default function useMediaQuery(query: string = MOBILE_QUERY): boolean {
  return useSyncExternalStore(
    subscribeToMediaQuery(query),
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(query).matches;
    },
    () => false, // SSR 시 기본값
  );
}
