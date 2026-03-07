import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className={styles.modal__overlay}>
      <button type="button" className={styles.modal__dim} onClick={onCancel} aria-label="닫기" />
      <div className={styles.modal__sheet}>
        <div className={styles['modal__title-area']}>
          <h2 className={styles.modal__title}>알림을 모두 삭제할까요?</h2>
        </div>
        <div className={styles.modal__body}>
          <div className={styles.modal__content}>
            <p className={styles.modal__description}>삭제한 알림은 되돌릴 수 없습니다.</p>
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
