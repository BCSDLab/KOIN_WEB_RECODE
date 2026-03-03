import { cn } from '@bcsdlab/utils';
import styles from './FilterButton.module.scss';

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function FilterButton({
  label, isActive = false, onClick, icon,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      className={cn({
        [styles["filter-button"]]: true,
        [styles['filter-button--active']]: isActive,
      })}
      onClick={onClick}
    >
      {icon && <span className={styles["filter-button__icon"]}>{icon}</span>}
      <span>{label}</span>
      <svg
        className={styles["filter-button__chevron"]}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
