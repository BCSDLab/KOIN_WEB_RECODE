import { cn } from '@bcsdlab/utils';
import ChevronDownIcon from 'assets/svg/Callvan/chevron-down.svg';
import styles from './FilterButton.module.scss';

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function FilterButton({ label, isActive = false, onClick, icon }: FilterButtonProps) {
  return (
    <button
      type="button"
      className={cn({
        [styles['filter-button']]: true,
        [styles['filter-button--active']]: isActive,
      })}
      onClick={onClick}
    >
      {icon && <span className={styles['filter-button__icon']}>{icon}</span>}
      <span>{label}</span>
      <ChevronDownIcon className={styles['filter-button__chevron']} aria-hidden="true" />
    </button>
  );
}
