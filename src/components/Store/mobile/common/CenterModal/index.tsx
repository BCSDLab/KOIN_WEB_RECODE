import { useLayoutEffect, type ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import Portal from 'components/Portal';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';

import styles from './CenterModal.module.scss';

// KOIN_ORDER_WEBVIEW components/UI/CenterModal 이전. 화면 가운데 뜨는 모달(배경 70%, 너비 최소 80%, 8px 라운드)
interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// order useScrollLock과 같게 열려 있는 동안만 body 스크롤을 막는다
function useBodyScrollLock(isLocked: boolean) {
  useLayoutEffect(() => {
    if (!isLocked || typeof window === 'undefined') return undefined;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}

export default function CenterModal({ isOpen, onClose, children, className }: CenterModalProps) {
  useBodyScrollLock(isOpen);

  const { containerRef, backgroundRef } = useOutsideClick<HTMLDialogElement>({
    onOutsideClick: () => onClose(),
  });

  if (!isOpen) return null;

  return (
    <Portal>
      <div ref={backgroundRef} className={styles.backdrop}>
        <dialog ref={containerRef} className={cn({ [styles.modal]: true, [className ?? '']: !!className })} open>
          {children}
        </dialog>
      </div>
    </Portal>
  );
}
