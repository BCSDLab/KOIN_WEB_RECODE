import { useCallback, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import useArrowKeyNavigation from 'utils/hooks/ui/useArrowKeyNavigation';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKey } from 'utils/hooks/ui/useEscapeKey';
import styles from './ImageModal.module.scss';

export interface ImageModalProps {
  imageList: string[]
  imageIndex: number
  onClose: () => void
}

function ImageModal({
  imageList,
  imageIndex,
  onClose,
}: ImageModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(imageIndex);
  const navigateImage = useCallback((move: number) => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex + move;
      return Math.max(0, Math.min(newIndex, imageList.length - 1));
    });
  }, [imageList.length]);

  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKey({ onEscape: onClose });
  useBodyScrollLock();

  useArrowKeyNavigation({ navigateImage });

  return (
    <div className={styles.background} ref={backgroundRef}>
      {selectedIndex !== 0 && (
        <button
          type="button"
          aria-label="이전 이미지"
          className={cn({
            [styles['arrow-button']]: true,
            [styles['arrow-button--prev']]: true,
          })}
          onClick={() => navigateImage(-1)}
        />
      )}
      {selectedIndex !== imageList.length - 1 && (
        <button
          type="button"
          aria-label="다음 이미지"
          className={cn({
            [styles['arrow-button']]: true,
            [styles['arrow-button--next']]: true,
          })}
          onClick={() => navigateImage(1)}
        />
      )}
      <button className={styles.close} type="button" aria-label="이미지 닫기" onClick={() => onClose()} />
      <img className={styles.image} src={`${imageList[selectedIndex]}`} alt="상점이미지" />
    </div>
  );
}

export default ImageModal;
