import { useLayoutEffect } from 'react';

// 여러 모달이 겹쳐 열려도 마지막 잠금이 풀릴 때만 원래 값으로 되돌린다
let lockCount = 0;
let originalOverflow = '';

// shouldLockScroll이 true인 동안만 body 스크롤을 막는다. 값이 바뀌면 그때마다 잠금·해제한다.
// 페인트 전에 잠가 모달이 열리는 첫 프레임에 배경이 스크롤되지 않게 한다
export const useBodyScrollLock = (shouldLockScroll = true) => {
  useLayoutEffect(() => {
    if (!shouldLockScroll || typeof window === 'undefined') return undefined;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [shouldLockScroll]);
};
