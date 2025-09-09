import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 576px)';

export default function useMediaQuery(query: string = MOBILE_QUERY): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // 컴포넌트가 마운트된 후 실제 미디어 쿼리 값으로 업데이트합니다.
    setMatches(matchMedia.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  // 서버 렌더링 및 클라이언트 첫 렌더링 시에는 기본값을 반환하고,
  // 마운트된 이후에 실제 값을 반환하여 하이드레이션 오류를 방지합니다.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? matches : false;
}
