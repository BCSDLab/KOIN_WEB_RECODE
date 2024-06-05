import { CafeteriaMenu } from 'interfaces/Cafeteria';
import { ReactComponent as NoMeal } from 'assets/svg/no-meals-mobile.svg';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-mobile.svg';
import styles from './MobileMealImage.module.scss';

interface Props {
  meal: CafeteriaMenu,
  handleImageClick: (item: CafeteriaMenu) => void,
}

export default function MobileMealImage({ meal, handleImageClick }: Props) {
  const isABC = ['A코너', 'B코너', 'C코너'].includes(meal.place);
  const hasImage = !!meal.image_url;
  const isBreakfast = meal.type === 'BREAKFAST';
  const isBoxVisible = !(!isABC || (isBreakfast && !hasImage));
  if (!isBoxVisible) return null;

  return (
    <button
      className={styles.image}
      type="button"
      onClick={() => handleImageClick(meal)}
    >
      {meal.soldout_at && (
        <div className={styles['image--sold-out']}>
          <NoMeal />
          품절된 메뉴입니다.
        </div>
      )}
      {hasImage
        ? <img src={meal.image_url!} alt="식단 사진" />
        : (
          <div className={styles['image--none']}>
            <NoPhoto />
            사진 없음
          </div>
        )}
    </button>
  );
}
