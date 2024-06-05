import { cn } from '@bcsdlab/utils';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-pc.svg';
import { ReactComponent as NoMeals } from 'assets/svg/no-meals-pc.svg';
import styles from './PCMealImage.module.scss';

interface Props {
  meal: CafeteriaMenu,
  isRecent: boolean,
  handleImageClick: (item: CafeteriaMenu) => void,
}

export default function PCMealImage({ meal, isRecent, handleImageClick }: Props) {
  const isABC = ['A코너', 'B코너', 'C코너'].includes(meal.place);
  const hasImage = !!meal.image_url;
  const isBreakfast = meal.type === 'BREAKFAST';
  const isBoxVisible = isRecent && !(!isABC || (isBreakfast && !hasImage));
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
        ? <img src={meal.image_url!} alt="식단 상세" />
        : <span><NoPhoto /></span>}
    </button>
  );
}
