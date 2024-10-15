import { cn } from '@bcsdlab/utils';
import { Dining } from 'interfaces/Cafeteria';
import NoPhoto from 'assets/svg/no-photography-mobile.svg';
import NoMeals from 'assets/svg/no-meals-mobile.svg';
import styles from './MobileMealImage.module.scss';

interface MobileMealImageProps {
  dining: Dining,
  handleImageClick: (dining: Dining) => void,
}

export default function MobileMealImage({ dining, handleImageClick }: MobileMealImageProps) {
  const isABC = ['A코너', 'B코너', 'C코너'].includes(dining.place);
  const hasImage = !!dining.image_url;
  const isBreakfast = dining.type === 'BREAKFAST';
  const isBoxVisible = isABC && (!isBreakfast || hasImage);
  if (!isBoxVisible) return null;

  return (
    <button
      type="button"
      className={cn({
        [styles.image]: true,
        [styles['image--no-image']]: !hasImage,
      })}
      onClick={() => handleImageClick(dining)}
    >
      {dining.soldout_at && (
        <span className={styles['image--sold-out']}>
          <NoMeals />
          품절된 메뉴입니다.
        </span>
      )}
      {hasImage
        ? <img src={dining.image_url!} alt="식단 사진" />
        : <NoPhoto />}
    </button>
  );
}
