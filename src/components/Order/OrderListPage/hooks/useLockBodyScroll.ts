import { useLayoutEffect } from 'react';

// order useScrollLock: 켜져 있는 동안만 body 스크롤을 막는다.
// 공용 useScrollLock은 첫 렌더 값만 반영해 검색창을 열고 닫을 때 잠금이 바뀌지 않는다
export default function useLockBodyScroll(isLocked: boolean) {
  useLayoutEffect(() => {
    if (!isLocked || typeof window === 'undefined') return undefined;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}
