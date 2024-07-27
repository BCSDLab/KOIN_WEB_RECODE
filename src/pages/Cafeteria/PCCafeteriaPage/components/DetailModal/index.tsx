import { ReactComponent as CloseIcon } from 'assets/svg/modal-close-icon.svg';
import { Dining } from 'interfaces/Cafeteria';
import { useClose } from 'utils/hooks/useClose';
import styles from './DetailModal.module.scss';

interface DetailModalProps {
  dining: Dining | null;
  closeModal: () => void;
}

export default function DetailModal({ dining, closeModal }: DetailModalProps): JSX.Element {
  const { backgroundRef } = useClose({ closeFunction: closeModal });

  if (!dining) return <div />;

  return (
    <div
      className={styles.overlay}
      ref={backgroundRef}
    >
      <div className={styles.modal}>
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
            onClick={() => closeModal()}
          >
            <CloseIcon />
          </button>
        </div>
        <img
          className={styles.modal__image}
          src={dining.image_url!}
          alt="menu"
        />
      </div>
    </div>
  );
}
