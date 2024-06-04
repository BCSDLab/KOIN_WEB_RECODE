import { ReactComponent as CloseIcon } from 'assets/svg/modal-close-icon.svg';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import styles from './MealDetail.module.scss';

interface MealDetailProps {
  cafeteriaMenu: CafeteriaMenu;
  setMealDetail: (element: JSX.Element) => void;
}

export default function MealDetail({ cafeteriaMenu, setMealDetail }: MealDetailProps): JSX.Element {
  const handleCloseModal = () => {
    setMealDetail(<div />);
  };

  return (
    <button
      className={styles.overlay}
      onClick={handleCloseModal}
      type="button"
    >
      <button
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        type="button"
      >
        <div className={styles['modal-header']}>
          <div className={styles['modal-header__place-chip']}>
            <div className={styles['modal-header__place']}>{cafeteriaMenu.place}</div>
            {cafeteriaMenu.soldout_at && <span className={`${styles['modal-header__chip']} ${styles['modal-header__chip--sold-out']}`}>품절</span>}
            {!cafeteriaMenu.soldout_at && cafeteriaMenu.changed_at && <span className={`${styles['modal-header__chip']} ${styles['modal-header__chip--changed']}`}>변경됨</span>}
          </div>
          <div className={styles['modal-header__detail']}>
            {!!cafeteriaMenu.kcal && `${cafeteriaMenu.kcal}kcal`}
            {!!cafeteriaMenu.kcal && !!cafeteriaMenu.price_card && !!cafeteriaMenu.price_cash && '•'}
            {!!cafeteriaMenu.price_card && !!cafeteriaMenu.price_cash && `${cafeteriaMenu.price_card}원/${cafeteriaMenu.price_cash}원`}
          </div>
          <button
            type="button"
            aria-label="닫기"
            className={styles['modal-header__close']}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </button>
        </div>
        <img
          className={styles.modal__image}
          src={cafeteriaMenu.image_url!}
          alt="menu"
        />
      </button>
    </button>
  );
}
