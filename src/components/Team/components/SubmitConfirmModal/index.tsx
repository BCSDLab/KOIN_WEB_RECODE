import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './SubmitConfirmModal.module.scss';

interface SubmitConfirmModalProps {
  message: string;
  description?: string;
  confirmLabel: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SubmitConfirmModal({
  message,
  description,
  confirmLabel,
  isSubmitting,
  onConfirm,
  onCancel,
}: SubmitConfirmModalProps) {
  const handleDismiss = () => {
    if (!isSubmitting) onCancel();
  };

  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: handleDismiss });
  useEscapeKeyDown({ onEscape: handleDismiss });

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal} ref={containerRef}>
        <div className={styles.modal__text}>
          <p className={styles.modal__message}>{message}</p>
          {description && <p className={styles.modal__description}>{description}</p>}
        </div>
        <div className={styles.modal__buttons}>
          <button type="button" className={styles.modal__cancel} onClick={onCancel} disabled={isSubmitting}>
            취소하기
          </button>
          <button type="button" className={styles.modal__confirm} onClick={onConfirm} disabled={isSubmitting}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
