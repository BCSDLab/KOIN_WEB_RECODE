import styles from './CallvanActionModal.module.scss';

interface CallvanActionModalProps {
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CallvanActionModal({
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: CallvanActionModalProps) {
  return (
    <div className={styles.modal__overlay}>
      <button type="button" className={styles.modal__dim} onClick={onCancel} aria-label="닫기" />
      <div className={styles.modal__sheet}>
        <div className={styles['modal__title-area']}>
          <h2 className={styles.modal__title}>{title}</h2>
        </div>
        <div className={styles.modal__body}>
          <div className={styles.modal__content}>
            <button type="button" className={styles['modal__btn-confirm']} onClick={onConfirm}>
              {confirmLabel}
            </button>
            <button type="button" className={styles['modal__btn-cancel']} onClick={onCancel}>
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
