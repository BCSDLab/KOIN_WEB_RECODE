import React from 'react';
import useModal from 'utils/hooks/useModal';
import cn from 'utils/ts/classnames';
import styles from './ImageModal.module.scss';

export interface ImageModalProps {
  image: {}[]
}

function ImageModal({
  image,
}: ImageModalProps) {
  const { hideModal } = useModal();
  const [selectedImage, setSelectedImage] = React.useState(image[0]);
  const selectedIndex = image.findIndex((value) => value === selectedImage);

  console.log(image, hideModal);
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
      <button className={styles.close} type="button" aria-label="close" onClick={hideModal} />
      <img className={styles.image} src={`${selectedImage}`} alt="상점이미지" />
    </div>
  );
}

export default ImageModal;
