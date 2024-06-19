import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { useEffect } from 'react';
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
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains(styles.background)) {
        onClose();
      }
    };
    const body = document.querySelector('body');
    body!.style.overflow = 'hidden';
    document.addEventListener('click', handleOutsideClick);
    return () => {
      body!.style.overflow = 'auto';
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className={styles.background}>
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
