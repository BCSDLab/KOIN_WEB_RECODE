import { cn } from '@bcsdlab/utils';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './CustomSelector.module.scss';

interface OptionList {
  label: string;
  value: string;
}
export interface SelectorProps {
  options: readonly OptionList[];
  value: string | null;
  isWhiteBackground?: boolean;
  dropDownMaxHeight?: number;
  placeholder?: string;
  disabled?: boolean;
  onChange: (event: { target: { value: string } }) => void;
}

function CustomSelector({
  options,
  value,
  isWhiteBackground = true,
  dropDownMaxHeight = 200,
  placeholder = '선택해주세요.',
  disabled = false,
  onChange,
}: SelectorProps) {
  const [isOpen, , closeMenu, triggerOpen] = useBooleanState(false);

  const onClickSelector = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerOpen();
  };

  const handleOptionClick = (optionValue: string) => {
    onChange({ target: { value: optionValue } });
    closeMenu();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: closeMenu });

  const selectedOption = options.find((option) => option.value === value);
  const showedLabel = selectedOption?.label ?? placeholder;
  const isPlaceholder = !selectedOption;

  return (
    <div
      ref={containerRef}
      className={cn({
        [styles.select]: true,
        [styles['select--opened']]: isOpen,
      })}
    >
      <button
        type="button"
        onClick={onClickSelector}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpen,
          [styles['select__trigger--white-background']]: isWhiteBackground,
          [styles['select__trigger--placeholder']]: isPlaceholder,
        })}
        disabled={disabled}
      >
        {showedLabel}
        <DownArrowIcon />
      </button>

      {isOpen && (
        <ul
          className={cn({
            [styles['select__contents-list']]: true,
            [styles['select__contents-list--opened']]: isOpen,
            [styles['select__contents-list--white-background']]: isWhiteBackground,
          })}
          role="listbox"
          style={{ maxHeight: `${dropDownMaxHeight}px` }}
        >
          {options.map((option) => (
            <li
              role="option"
              key={option.value}
              className={styles.select__content}
              aria-selected={option.value === value}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOptionClick(option.value);
                  e.preventDefault();
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

export default CustomSelector;
