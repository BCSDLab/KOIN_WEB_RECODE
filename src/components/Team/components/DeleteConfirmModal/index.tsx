import { useEffect, useRef } from 'react';

import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  isPending: boolean;
  onCancel: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isPending, onCancel, onClose, onConfirm }: DeleteConfirmModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const handleClose = () => {
    if (!isPending) onClose();
  };
  const handleCancel = () => {
    if (!isPending) onCancel();
  };
  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: handleClose });

  useEscapeKeyDown({ onEscape: handleClose });
  useBodyScrollLock();

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modalElement = containerRef.current;

    cancelButtonRef.current?.focus();

    const handleTabKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalElement) return;

      const focusableButtons = [cancelButtonRef.current, confirmButtonRef.current].filter(
        (button): button is HTMLButtonElement => button !== null && !button.disabled,
      );

      if (focusableButtons.length === 0) {
        event.preventDefault();
        modalElement.focus();
        return;
      }

      const firstFocusableElement = focusableButtons[0];
      const lastFocusableElement = focusableButtons[focusableButtons.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstFocusableElement || !modalElement.contains(activeElement))) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && (activeElement === lastFocusableElement || !modalElement.contains(activeElement))) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKeyDown);

    return () => {
      document.removeEventListener('keydown', handleTabKeyDown);
      if (previouslyFocusedElement?.isConnected) previouslyFocusedElement.focus();
    };
  }, [containerRef]);

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div
        className={styles.modal}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-recruitment-title"
        tabIndex={-1}
      >
        <div className={styles.modal__contents}>
          <p id="delete-recruitment-title" className={styles.modal__text}>
            모집글을 삭제하시겠습니까?
          </p>
          <p className={styles.modal__description}>삭제한 모집글은 다시 복구할 수 없습니다.</p>
        </div>
        <div className={styles.modal__buttons}>
          <button
            ref={confirmButtonRef}
            type="button"
            className={styles['modal__button--confirm']}
            disabled={isPending}
            onClick={onConfirm}
          >
            삭제하기
          </button>
          <button
            ref={cancelButtonRef}
            type="button"
            className={styles['modal__button--cancel']}
            disabled={isPending}
            onClick={handleCancel}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}
