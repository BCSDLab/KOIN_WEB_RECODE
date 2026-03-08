import { cn } from '@bcsdlab/utils';
import useToastTimer from 'utils/hooks/ui/useToastTimer';
import styles from './CallvanToast.module.scss';

interface CallvanToastProps {
  message: string;
  onClose: () => void;
}

export default function CallvanToast({ message, onClose }: CallvanToastProps) {
  const [toastProps, isVisible] = useToastTimer({ autoCloseTime: 3000, onClose });

  return (
    <div
      className={cn({
        [styles.toast]: true,
        [styles['toast--hidden']]: !isVisible,
      })}
      onMouseEnter={toastProps.onMouseEnter}
      onMouseLeave={toastProps.onMouseLeave}
    >
      {message}
    </div>
  );
}
