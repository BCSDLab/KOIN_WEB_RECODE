import { cn } from '@bcsdlab/utils';
import {
  useCallback, useEffect, useRef,
} from 'react';
import useToastTimer from 'utils/hooks/ui/useToastTimer';
import styles from './TimetableToast.module.scss';

export interface Toast {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function TimetableToast({
  message, onClose, duration = 5000,
}: Toast) {
  // const [isClicked, setIsClicked] = useState(false);
  const toastRef = useRef<HTMLDivElement | null>(null);

  const [toastProps, isVisible, closeToast] = useToastTimer({
    autoCloseTime: duration,
    onClose,
  });

  const updateToastPosition = useCallback(() => {
    const toast = toastRef.current;
    const distanceFromBottom = 32;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (toast) {
      toast.style.bottom = `${distanceFromBottom - scrollPosition}px`;
    }
  }, []);

  // const handleRecoverClick = () => {
  //   setIsClicked(true);
  //   onRecover();
  // };

  useEffect(() => {
    updateToastPosition();
    window.addEventListener('scroll', updateToastPosition);
    return () => {
      window.removeEventListener('scroll', updateToastPosition);
    };
  }, [updateToastPosition]);

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
      {/* TODO: 되돌리기 구현하기
      {!isClicked ? (
        <>
          <div className={styles.toast__message}>{message}</div>
          <button className={styles.toast__button} type="button" onClick={handleRecoverClick}>
            되돌리기
          </button>
        </>
      ) : (
        <>
          <div className={styles.toast__message}>{recoverMessage}</div>
          <button className={styles.toast__button} type="button" onClick={closeToast}>확인</button>
        </>
      )}
      */}
      <div className={styles.toast__message}>{message}</div>
      <button className={styles.toast__button} type="button" onClick={closeToast}>확인</button>
    </div>
  );
}

TimetableToast.defaultProps = {
  duration: 5000,
};
