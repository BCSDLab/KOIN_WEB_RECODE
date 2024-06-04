import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import { ReactComponent as NoMeal } from 'assets/svg/no-meals-mobile.svg';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-mobile.svg';
import styles from './MenuImage.module.scss';

interface Props {
  meal: CafeteriaMenu,
  mealType: MealType,
  handleImageClick: (item: CafeteriaMenu) => void,
}

export default function MenuImage({ meal, mealType, handleImageClick }: Props) {
  return (
    <div>
      {[1, 2, 3].includes(meal.id) && mealType
        && (
        <button
          className={styles['category__menu-photo']}
          type="button"
          onClick={() => handleImageClick(meal)}
        >
          {meal.soldout_at && (
          <div className={styles['category__menu-photo--sold-out']}>
            <NoMeal />
            품절된 메뉴입니다.
          </div>
          )}
          {meal.image_url
            ? <img src={meal?.image_url || ''} alt="" />
            : (
              <div className={styles['category__menu-photo--none']}>
                <NoPhoto />
                사진 없음
              </div>
            )}
        </button>
        )}
    </div>
  );
}
