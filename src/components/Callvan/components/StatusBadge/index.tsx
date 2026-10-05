import { cn } from '@bcsdlab/utils';
import styles from './StatusBadge.module.scss';

interface StatusBadgeProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function StatusBadge({ label, isActive, onClick }: StatusBadgeProps) {
  return (
    <button
      type="button"
      className={cn({
        [styles.badge]: true,
        [styles['badge--active']]: isActive,
      })}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
