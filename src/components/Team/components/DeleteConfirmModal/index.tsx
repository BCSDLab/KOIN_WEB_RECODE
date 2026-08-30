import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isPending, onCancel, onConfirm }: DeleteConfirmModalProps) {
  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: onCancel });

  useEscapeKeyDown({ onEscape: onCancel });
  useBodyScrollLock();

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div
        className={styles.modal}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-recruitment-title"
      >
        <p id="delete-recruitment-title" className={styles.modal__text}>
          해당 모집글을 삭제하시겠습니까?
        </p>
        <div className={styles.modal__buttons}>
          <button type="button" className={styles['modal__button--cancel']} disabled={isPending} onClick={onCancel}>
            취소하기
          </button>
          <button type="button" className={styles['modal__button--confirm']} disabled={isPending} onClick={onConfirm}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
