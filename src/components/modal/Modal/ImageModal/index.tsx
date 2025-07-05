import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { cn } from '@bcsdlab/utils';
import useArrowKeyNavigation from 'utils/hooks/ui/useArrowKeyNavigation';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { createTouchHandlers } from 'utils/ts/touchHandler';
import styles from './ImageModal.module.scss';

export interface ImageModalProps {
  imageList: string[];
  imageIndex: number;
  onClose: () => void;
}

function ImageModal({
  imageList,
  imageIndex,
  onClose,
}: ImageModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(imageIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const startDistanceRef = useRef(0);
  const startTranslateRef = useRef({ x: 0, y: 0 });
  const startTouchRef = useRef<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const navigateImage = useCallback((move: number) => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex + move;
      return Math.max(0, Math.min(newIndex, imageList.length - 1));
    });
  }, [imageList.length]);

  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });
  useBodyScrollLock();

  useArrowKeyNavigation({ navigateImage });

  useEffect(() => {
    const imageEl = imageRef.current;
    if (!imageEl) return () => {};

    const { handleTouchStart, handleTouchMove, handleTouchEnd } = createTouchHandlers({
      scale,
      setScale,
      translate,
      setTranslate,
      startDistanceRef,
      startTranslateRef,
      startTouchRef,
    });

    imageEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    imageEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    imageEl.addEventListener('touchend', handleTouchEnd);

    return () => {
      imageEl.removeEventListener('touchstart', handleTouchStart);
      imageEl.removeEventListener('touchmove', handleTouchMove);
      imageEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, translate]);

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
      <img
        ref={imageRef}
        className={styles.image}
        src={imageList[selectedIndex]}
        alt="상점이미지"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
        }}
      />

    </div>
  );
}

export default ImageModal;
