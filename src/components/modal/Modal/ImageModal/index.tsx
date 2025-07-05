import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { cn } from '@bcsdlab/utils';
import useArrowKeyNavigation from 'utils/hooks/ui/useArrowKeyNavigation';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
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

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDistanceRef.current = Math.hypot(dx, dy);
      } else if (e.touches.length === 1 && scale > 1) {
        startTouchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        startTranslateRef.current = { ...translate };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDistance = Math.hypot(dx, dy);
        const newScale = newDistance / startDistanceRef.current;

        setScale((prev) => {
          const clamped = Math.min(Math.max(prev * newScale, 1), 3);
          startDistanceRef.current = newDistance;
          return clamped;
        });
      } else if (e.touches.length === 1 && scale > 1 && startTouchRef.current) {
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startTouchRef.current.x;
        const deltaY = e.touches[0].clientY - startTouchRef.current.y;

        setTranslate({
          x: startTranslateRef.current.x + deltaX,
          y: startTranslateRef.current.y + deltaY,
        });
      }
    };

    const handleTouchEnd = () => {
      if (scale < 1.05) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      }
      startTouchRef.current = null;
    };

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
          transition: 'transform 0.1s ease',
          touchAction: 'none',
        }}
      />

    </div>
  );
}

export default ImageModal;
