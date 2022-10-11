import React from 'react';
import cn from 'utils/ts/classnames';
import styles from './ImageModal.module.scss';

export interface ImageModalProps {
  image: {}[]
  selectImg: number
  onClose: () => void
}

function ImageModal({
  image,
  selectImg,
  onClose,
}: ImageModalProps) {
  const [selectedImage, setSelectedImage] = React.useState(image[selectImg]);
  const selectedIndex = image.findIndex((value) => value === selectedImage);

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
          onClick={() => setSelectedImage(image[selectedIndex - 1])}
        />
      )}
      {selectedIndex !== image.length - 1 && (
        <button
          type="button"
          aria-label="next"
          className={cn({
            [styles['arrow-button']]: true,
            [styles['arrow-button--next']]: true,
          })}
          onClick={() => setSelectedImage(image[selectedIndex + 1])}
        />
      )}
      <button className={styles.close} type="button" aria-label="close" onClick={() => onClose()} />
      <img className={styles.image} src={`${selectedImage}`} alt="상점이미지" />
    </div>
  );
}

export default ImageModal;
