import { ReactComponent as CloseIcon } from 'assets/svg/modal-close-icon.svg';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import styles from './MealDetail.module.scss';

interface MealDetailProps {
  item: CafeteriaMenu;
  setMealDetail: (element: JSX.Element) => void;
}

export default function MealDetail({ item, setMealDetail }: MealDetailProps): JSX.Element {
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
            <div className={styles['modal-header__place']}>{item.place}</div>
            {item.soldout_at && <span className={`${styles['modal-header__chip']} ${styles['modal-header__chip--sold-out']}`}>품절</span>}
            {!item.soldout_at && item.changed_at && <span className={`${styles['modal-header__chip']} ${styles['modal-header__chip--changed']}`}>변경됨</span>}
          </div>
          <div className={styles['modal-header__detail']}>
            {!!item.kcal && `${item.kcal}kcal`}
            {!!item.kcal && !!item.price_card && !!item.price_cash && '•'}
            {!!item.price_card && !!item.price_cash && `${item.price_card}원/${item.price_cash}원`}
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
          src={item.image_url!}
          alt="menu"
        />
      </button>
    </button>
  );
}
