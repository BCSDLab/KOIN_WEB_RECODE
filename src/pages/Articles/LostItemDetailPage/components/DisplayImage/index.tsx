import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import SelectedDotIcon from 'assets/svg/Articles/ellipse-blue.svg';
import NotSelectedDotIcon from 'assets/svg/Articles/ellipse-grey.svg';
import ChevronRight from 'assets/svg/Articles/chevron-right-circle.svg';
import ChevronLeft from 'assets/svg/Articles/chevron-left-circle.svg';
import { Image } from 'pages/Articles/ts/types';
import styles from './DisplayImage.module.scss';

interface DisplayImageProps {
  images: Image[];
}

export default function DisplayImage({
  images,
}: DisplayImageProps) {
  const [image, setImage] = useState(images[0]);
  const imageIndex = images.findIndex((img) => img.id === image.id);

  const handleArrowButtonClick = (diff: 1 | -1) => {
    setImage(images[(imageIndex + diff) % images.length]);
  };

  return (
    <div className={styles.container}>
      {images.length > 0 && (
        <div className={styles.images}>
          <img
            className={styles.images__image}
            src={image.imageUrl}
            alt="분실물 이미지"
          />
          <button
            className={cn({
              [styles.images__button]: true,
              [styles['images__button--left']]: true,
              [styles['images__button--hidden']]: images.length === 1 || imageIndex === 0,
            })}
            onClick={() => handleArrowButtonClick(-1)}
            type="button"
            aria-label="다음 이미지 보기"
          >
            <ChevronLeft />
          </button>
          <button
            className={cn({
              [styles.images__button]: true,
              [styles['images__button--right']]: true,
              [styles['images__button--hidden']]: images.length === 1 || imageIndex === images.length - 1,
            })}
            onClick={() => handleArrowButtonClick(1)}
            type="button"
            aria-label="다음 이미지 보기"
          >
            <ChevronRight />
          </button>
        </div>
      )}
      <div className={styles.navigation}>
        {images.length > 1 && images.map((currentImage, index) => (
          <button
            key={currentImage.imageUrl}
            onClick={() => setImage(currentImage)}
            type="button"
          >
            {imageIndex === index ? <SelectedDotIcon /> : <NotSelectedDotIcon />}
          </button>
        ))}
      </div>
    </div>
  );
}
