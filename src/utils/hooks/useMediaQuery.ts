import { useEffect, useRef, useState } from 'react';

const MOBILE_QUERY = '(max-width: 576px)';

export default function useMediaQuery(query = MOBILE_QUERY): boolean {
  const getMatches = (matchedQuery: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(matchedQuery).matches;
    }
    return false;
  };
  const [matches, setMatches] = useState(() => getMatches(query));
  const matchMediaRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    matchMediaRef.current = matchMedia;
    function handleChange() {
      setMatches(getMatches(query));
    }
    handleChange();
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMediaRef.current?.removeEventListener('change', handleChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}
