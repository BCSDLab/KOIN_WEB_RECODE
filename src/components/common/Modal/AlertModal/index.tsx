import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './AlertModal.module.scss';

interface AlertModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AlertModal({
  title, description, onClose, onConfirm,
}: AlertModalProps) {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });
  useBodyScrollLock();

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles.modal__header}>
          <h1 className={styles.modal__title}>{title}</h1>
          <CloseIcon className={styles['modal__close-icon']} onClick={onClose} />
        </div>
        <p className={styles.modal__description}>{description}</p>
        <div className={styles['modal__button-group']}>
          <button type="button" className={styles['modal__close-button']} onClick={onClose}>취소</button>
          <button
            type="button"
            className={styles['modal__confirm-button']}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
