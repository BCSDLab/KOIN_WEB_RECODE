import React from 'react';
import { cn } from '@bcsdlab/utils';
import styles from './ImageModal.module.scss';
import useModalKeyboardEvent from './hooks/useModalKeyboardEvent';

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
  const [selectedIndex, setSelectedIndex] = React.useState(imageIndex);
  const onChangeImageIndex = React.useCallback((move: number) => {
    if (move < 0) {
      return (selectedIndex !== 0 && (
        setSelectedIndex(selectedIndex + move)
      ));
    }
    return (selectedIndex !== imageList.length - 1 && (
      setSelectedIndex(selectedIndex + move)
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]); // imageList 의존성 불필요

  useModalKeyboardEvent({ onClose, onChangeImageIndex });

  React.useEffect(() => {
    const body = document.querySelector('body');
    body!.style.overflow = 'hidden';

    return () => { body!.style.overflow = 'auto'; };
  }, []);

  return (
    <div className={styles.background}>
      {selectedIndex !== 0 && (
        <button
          type="button"
          aria-label="이전 이미지"
          className={cn({
            [styles['arrow-button']]: true,
            [styles['arrow-button--prev']]: true,
          })}
          onClick={() => onChangeImageIndex(-1)}
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
          onClick={() => onChangeImageIndex(1)}
        />
      )}
      <button className={styles.close} type="button" aria-label="이미지 닫기" onClick={() => onClose()} />
      <img className={styles.image} src={`${imageList[selectedIndex]}`} alt="상점이미지" />
    </div>
  );
}

export default ImageModal;
