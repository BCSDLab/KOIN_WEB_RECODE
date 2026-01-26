import type { ReactNode, HTMLAttributes } from 'react';
import { useRef } from 'react';
import Portal from 'components/Portal';
import useHandleOutside from 'utils/hooks/ui/useHandleOutside';
import { useScrollLock } from 'utils/hooks/ui/useScrollLock';
import styles from './BottomModal.module.scss';

type BottomModalProps = HTMLAttributes<HTMLDialogElement> & {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomModal({ isOpen, onClose, children, className, ...rest }: BottomModalProps) {
  const containerRef = useRef<HTMLDialogElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  useHandleOutside<HTMLDialogElement, HTMLDivElement>({
    containerRef,
    backgroundRef,
    onOutsideClick: (e) => {
      e.preventDefault?.();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <Portal>
      <div ref={backgroundRef} className={styles.backdrop}>
        <dialog
          ref={containerRef}
          className={[styles.modal, className].filter(Boolean).join(' ')}
          open={isOpen}
          {...rest}
        >
          {children}
        </dialog>
      </div>
    </Portal>
  );
}

type BottomModalSectionProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function BottomModalHeader({ children, className, ...rest }: BottomModalSectionProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function BottomModalContent({ children, className, ...rest }: BottomModalSectionProps) {
  return (
    <div className={[styles.content, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function BottomModalFooter({ children, className, ...rest }: BottomModalSectionProps) {
  return (
    <div className={[styles.footer, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
