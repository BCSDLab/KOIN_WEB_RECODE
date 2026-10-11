import { useLayoutEffect } from 'react';

import Portal from 'components/Portal';

import styles from './ImagePreview.module.scss';

// KOIN_ORDER_WEBVIEW ReviewCard의 이미지 미리보기 이전. 배경을 누르면 닫고, 여는 동안 body 스크롤을 막는다
interface ImagePreviewProps {
  src: string | null;
  onClose: () => void;
}

function useBodyScrollLock(isLocked: boolean) {
  useLayoutEffect(() => {
    if (!isLocked || typeof window === 'undefined') return undefined;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}

export default function ImagePreview({ src, onClose }: ImagePreviewProps) {
  useBodyScrollLock(!!src);

  if (!src) return null;

  return (
    <Portal>
      <div role="presentation" tabIndex={-1} className={styles.preview} onClick={onClose}>
        <div role="presentation" tabIndex={-1} className={styles.preview__frame} onClick={(e) => e.stopPropagation()}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 리뷰 이미지는 외부 업로드 URL을 order처럼 그대로 그린다 */}
          <img src={src} alt="" className={styles.preview__image} />
        </div>
      </div>
    </Portal>
  );
}
