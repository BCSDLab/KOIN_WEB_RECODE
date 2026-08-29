import { cn } from '@bcsdlab/utils';
import ChevronDownIcon from 'assets/svg/Team/chevron-down-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './DeptSelect.module.scss';

interface DeptOption {
  label: string;
  value: string;
}

interface DeptSelectProps {
  options: readonly DeptOption[];
  value: string | null;
  placeholder?: string;
  onChange: (event: { target: { value: string } }) => void;
  id?: string;
  disabled?: boolean;
  ariaDescribedBy?: string;
}

export default function DeptSelect({
  options,
  value,
  placeholder = '선택해주세요.',
  onChange,
  id,
  disabled = false,
  ariaDescribedBy,
}: DeptSelectProps) {
  const [isOpen, , closeMenu, triggerOpen] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closeMenu });

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerOpen();
  };

  const handleOptionClick = (optionValue: string) => {
    onChange({ target: { value: optionValue } });
    closeMenu();
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className={styles.deptSelect}>
      <button
        type="button"
        id={id}
        className={cn({
          [styles.deptSelect__trigger]: true,
          [styles['deptSelect__trigger--opened']]: isOpen,
          [styles['deptSelect__trigger--selected']]: Boolean(selectedOption),
        })}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={handleTriggerClick}
      >
        {selectedOption?.label ?? placeholder}
        <ChevronDownIcon aria-hidden />
      </button>

      {isOpen && (
        <ul className={styles.deptSelect__list} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              tabIndex={0}
              aria-selected={option.value === value}
              className={styles.deptSelect__option}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionClick(option.value);
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
