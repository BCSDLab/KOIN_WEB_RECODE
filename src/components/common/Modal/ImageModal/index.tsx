import React from 'react';
import cn from 'utils/ts/classnames';
import useBackEvent from 'components/common/Modal/hooks/useBackEvent';
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

  useModalKeyboardEvent({ onClose, handleClickImage });
  useBackEvent(onClose);

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
