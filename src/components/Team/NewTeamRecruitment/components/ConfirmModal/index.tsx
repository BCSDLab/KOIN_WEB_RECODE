import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ onCancel, onConfirm }: ConfirmModalProps) {
  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: onCancel });
  useEscapeKeyDown({ onEscape: onCancel });

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div className={styles.modal} ref={containerRef}>
        <p className={styles.modal__text}>해당 모집글을 등록하시겠습니까?</p>
        <div className={styles.modal__buttons}>
          <button type="button" className={styles['modal__button--cancel']} onClick={onCancel}>
            취소하기
          </button>
          <button type="button" className={styles['modal__button--confirm']} onClick={onConfirm}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
