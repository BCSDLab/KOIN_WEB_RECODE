import { cn } from '@bcsdlab/utils';
import { Dining } from 'interfaces/Cafeteria';
import { ReactComponent as NoMeals } from 'assets/svg/no-meals-mobile.svg';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-mobile.svg';
import styles from './MobileMealImage.module.scss';

interface Props {
  meal: Dining,
  handleImageClick: (item: Dining) => void,
}

export default function MobileMealImage({ meal, handleImageClick }: Props) {
  const isABC = ['A코너', 'B코너', 'C코너'].includes(meal.place);
  const hasImage = !!meal.image_url;
  const isBreakfast = meal.type === 'BREAKFAST';
  const isBoxVisible = isABC && (!isBreakfast || hasImage);
  if (!isBoxVisible) return null;

  return (
    <button
      type="button"
      className={cn({
        [styles.image]: true,
        [styles['image--no-image']]: !hasImage,
      })}
      onClick={() => handleImageClick(meal)}
    >
      {meal.soldout_at && (
        <span className={styles['image--sold-out']}>
          <NoMeals />
          품절된 메뉴입니다.
        </span>
      )}
      {hasImage
        ? <img src={meal.image_url!} alt="식단 사진" />
        : <span><NoPhoto /></span>}
    </button>
  );
}
