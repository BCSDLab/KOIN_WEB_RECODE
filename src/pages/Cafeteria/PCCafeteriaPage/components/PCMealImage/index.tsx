import { cn } from '@bcsdlab/utils';
import { Dining } from 'interfaces/Cafeteria';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-pc.svg';
import { ReactComponent as NoMeals } from 'assets/svg/no-meals-pc.svg';
import styles from './PCMealImage.module.scss';

interface Props {
  dining: Dining,
  isThisWeek: boolean,
  handleImageClick: (dining: Dining) => void,
}

export default function PCMealImage({ dining, isThisWeek, handleImageClick }: Props) {
  const isABC = ['A코너', 'B코너', 'C코너'].includes(dining.place);
  const hasImage = !!dining.image_url;
  const isBreakfast = dining.type === 'BREAKFAST';
  const isBoxVisible = isThisWeek && isABC && (!isBreakfast || hasImage);
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
        ? <img src={dining.image_url!} alt="식단 상세" />
        : <NoPhoto />}
    </button>
  );
}
