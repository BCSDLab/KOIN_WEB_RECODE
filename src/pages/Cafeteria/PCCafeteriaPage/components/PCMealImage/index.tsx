import { CafeteriaMenu } from 'interfaces/Cafeteria';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-pc.svg';
import { ReactComponent as NoMeals } from 'assets/svg/no-meals-pc.svg';
import styles from './PCMealImage.module.scss';

interface Props {
  meal: CafeteriaMenu,
  handleImageClick: (item: CafeteriaMenu) => void,
}

export default function PCMealImage({ meal, handleImageClick }: Props) {
  return (
    <>
      {meal.image_url ? (
        <button type="button" onClick={() => handleImageClick(meal)}>
          <img className={styles.content__image} src={meal.image_url} alt="식단 상세" />
        </button>
      ) : (
        !meal.soldout_at && (<span className={styles.content__image}><NoPhoto /></span>)
      )}
      {meal.soldout_at && (
        <span className={styles.content__overlay}>
          <span className={styles['content__no-meals']}>
            <NoMeals />
            품절된 메뉴입니다.
          </span>
        </span>
      )}
    </>
  );
}
