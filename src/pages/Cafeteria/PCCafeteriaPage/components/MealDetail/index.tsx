import { ReactComponent as CloseIcon } from 'assets/svg/modal-close-icon.svg';
import { Dining } from 'interfaces/Cafeteria';
import styles from './MealDetail.module.scss';

interface MealDetailProps {
  dining: Dining;
  setMealDetail: (element: JSX.Element) => void;
}

export default function MealDetail({ dining, setMealDetail }: MealDetailProps): JSX.Element {
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
            <div className={styles['modal-header__place']}>{dining.place}</div>
            {dining.soldout_at && <span className={`${styles['modal-header__chip']} ${styles['modal-header__chip--sold-out']}`}>품절</span>}
            {!dining.soldout_at && dining.changed_at && <span className={`${styles['modal-header__chip']} ${styles['modal-header__chip--changed']}`}>변경됨</span>}
          </div>
          <div className={styles['modal-header__detail']}>
            {!!dining.kcal && `${dining.kcal}kcal`}
            {!!dining.kcal && !!dining.price_card && !!dining.price_cash && '•'}
            {!!dining.price_card && !!dining.price_cash && `${dining.price_card}원/${dining.price_cash}원`}
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
          src={dining.image_url!}
          alt="menu"
        />
      </button>
    </button>
  );
}
