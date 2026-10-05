import styles from './CloseConfirmModal.module.scss';

interface CloseConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CloseConfirmModal({ onConfirm, onCancel }: CloseConfirmModalProps) {
  return (
    <div className={styles.modal__overlay}>
      <button type="button" className={styles.modal__dim} onClick={onCancel} aria-label="닫기" />
      <div className={styles.modal__sheet}>
        <div className={styles['modal__title-area']}>
          <h2 className={styles.modal__title}>해당 콜밴팟 모집을 마감할까요?</h2>
        </div>
        <div className={styles.modal__body}>
          <div className={styles.modal__content}>
            <button type="button" className={styles['modal__btn-confirm']} onClick={onConfirm}>
              예
            </button>
            <button type="button" className={styles['modal__btn-cancel']} onClick={onCancel}>
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
