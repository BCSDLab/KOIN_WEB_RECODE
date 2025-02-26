import { cn } from '@bcsdlab/utils';
import {
  useRef, useState,
} from 'react';
import useToastTimer from 'utils/hooks/ui/useToastTimer';
import styles from './TimetableToast.module.scss';

export interface Toast {
  message: string;
  recoverMessage?: string;
  onClose: () => void;
  onRecover?: () => void;
  showRecoverButton?: boolean;
  duration?: number;
}

export default function TimetableToast({
  message,
  recoverMessage,
  onClose,
  onRecover,
  showRecoverButton = true,
  duration = 5000,
}: Toast) {
  const [isClicked, setIsClicked] = useState(false);
  const toastRef = useRef<HTMLDivElement | null>(null);

  const [toastProps, isVisible] = useToastTimer({
    autoCloseTime: duration,
    onClose,
  });

  const handleRecoverClick = () => {
    setIsClicked(true);
    if (onRecover !== undefined) {
      onRecover();
    }
  };

  return (
    <div
      className={cn({
        [styles.toast]: true,
        [styles.toast__close]: !isVisible,
      })}
      ref={toastRef}
      onMouseEnter={toastProps.onMouseEnter}
      onMouseLeave={toastProps.onMouseLeave}
    >
      {!isClicked ? (
        <>
          <div className={styles.toast__message}>{message}</div>
          {
            recoverMessage && showRecoverButton && (
              <button className={styles.toast__button} type="button" onClick={handleRecoverClick}>취소하기</button>
            )
          }
        </>
      ) : (
        <div className={styles.toast__message}>{recoverMessage}</div>
      )}
    </div>
  );
}
