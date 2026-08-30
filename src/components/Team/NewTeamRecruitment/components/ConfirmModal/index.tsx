import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  confirmLabel?: string;
  description?: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  confirmLabel = '등록하기',
  description = '해당 모집글을 등록하시겠습니까?',
  isPending = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const handleCancel = () => {
    if (!isPending) onCancel();
  };
  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: handleCancel });

  useEscapeKeyDown({ onEscape: handleCancel });
  useBodyScrollLock();

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div
        className={styles.modal}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-recruitment-confirm-title"
      >
        <p id="team-recruitment-confirm-title" className={styles.modal__text}>
          {description}
        </p>
        <div className={styles.modal__buttons}>
          <button
            type="button"
            className={styles['modal__button--cancel']}
            disabled={isPending}
            onClick={handleCancel}
          >
            취소하기
          </button>
          <button type="button" className={styles['modal__button--confirm']} disabled={isPending} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
