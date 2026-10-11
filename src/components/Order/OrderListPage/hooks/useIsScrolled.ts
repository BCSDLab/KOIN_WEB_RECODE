import { useEffect } from 'react';

import useBooleanState from 'utils/hooks/state/useBooleanState';

// order OrderList useScrolled: 페이지가 조금이라도 스크롤되면 검색·필터 영역에 그림자를 준다
export default function useIsScrolled() {
  const [isScrolled, setTrue, setFalse] = useBooleanState(false);

  useEffect(() => {
    const onScroll = () => (window.scrollY > 0 ? setTrue() : setFalse());
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [setTrue, setFalse]);

  return isScrolled;
}
