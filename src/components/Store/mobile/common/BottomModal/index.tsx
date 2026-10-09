import { useLayoutEffect, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import Portal from 'components/Portal';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';

import styles from './BottomModal.module.scss';

// KOIN_ORDER_WEBVIEW components/UI/BottomModal 이전. 화면 아래에 붙는 시트(배경 70%, 위쪽 32px 라운드, shadow-4)
interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// 공용 useScrollLock은 첫 렌더 값만 반영해 열고 닫을 때 잠금이 바뀌지 않는다. order처럼 열려 있는 동안만 body 스크롤을 막는다
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

export default function BottomModal({ isOpen, onClose, children, className }: BottomModalProps) {
  useBodyScrollLock(isOpen);

  const { containerRef, backgroundRef } = useOutsideClick<HTMLDialogElement>({
    onOutsideClick: (e) => {
      e.preventDefault?.();
      onClose();
    },
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

interface BottomModalSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function BottomModalHeader({ children, className }: BottomModalSectionProps) {
  return <div className={cn({ [styles.header]: true, [className ?? '']: !!className })}>{children}</div>;
}

export function BottomModalContent({ children, className }: BottomModalSectionProps) {
  return <div className={cn({ [styles.content]: true, [className ?? '']: !!className })}>{children}</div>;
}

export function BottomModalFooter({ children, className }: BottomModalSectionProps) {
  return <div className={cn({ [styles.footer]: true, [className ?? '']: !!className })}>{children}</div>;
}
