import React from 'react';
import cn from 'utils/ts/classnames';
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
  const [selectedImage, setSelectedImage] = React.useState(imageList[imageIndex]);
  const selectedIndex = imageList.findIndex((value) => value === selectedImage);

  const handleClickImage = React.useCallback((move: number) => {
    if (move < 0) {
      return (selectedIndex !== 0 && (
        setSelectedImage(imageList[selectedIndex + move])
      ));
    }

    return (selectedIndex !== imageList.length - 1 && (
      setSelectedImage(imageList[selectedIndex + move])
    ));
  }, [imageList, selectedIndex]);

  React.useEffect(() => {
    const pressKey = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
      } else if (event.code === 'ArrowLeft') {
        handleClickImage(-1);
      } else if (event.code === 'ArrowRight') {
        handleClickImage(1);
      }
    };
    window.addEventListener('keydown', (event: KeyboardEvent) => pressKey(event));
    return () => window.removeEventListener('keydown', (event: KeyboardEvent) => pressKey(event));
  }, [onClose, handleClickImage]);

  return (
    <div className={styles.background}>
      {selectedIndex !== 0 && (
        <button
          type="button"
          aria-label="prev"
          className={cn({
            [styles['arrow-button']]: true,
            [styles['arrow-button--prev']]: true,
          })}
          onClick={() => handleClickImage(-1)}
        />
      )}
      {selectedIndex !== imageList.length - 1 && (
        <button
          type="button"
          aria-label="next"
          className={cn({
            [styles['arrow-button']]: true,
            [styles['arrow-button--next']]: true,
          })}
          onClick={() => handleClickImage(1)}
        />
      )}
      <button className={styles.close} type="button" aria-label="close" onClick={() => onClose()} />
      <img className={styles.image} src={`${selectedImage}`} alt="상점이미지" />
    </div>
  );
}

export default ImageModal;
