import { cn } from '@bcsdlab/utils';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import TrashCanIcon from 'assets/svg/trash-can-icon.svg';
import SettingIcon from 'assets/svg/setting-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './Selector.module.scss';

type SelectorType = 'delete' | 'setting' | 'default';
// type SelectorVersion = 'default' | 'inSignup' | 'inTimetable';

interface OptionList {
  label: string;
  value: string;
}
interface SelectorProps {
  options: OptionList[];
  value: string | null;
  type: SelectorType;
  // version?: SelectorVersion;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onDelete?: (value: string) => void;
  onSettingsClick?: (value: string) => void;
}

export function Selector({
  options,
  value,
  type = 'default',
  // version = 'default',
  placeholder = '선택해주세요.',
  disabled = false,
  onChange,
  onDelete,
  onSettingsClick,
}: SelectorProps) {
  const [isOpen, , setFalse, triggerOpen] = useBooleanState(false);

  const onClickSelector = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerOpen();
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setFalse();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: setFalse });

  const selectedOption = options.find((option) => option.value === value);
  const showLabel = selectedOption?.label ?? placeholder;

  const isOverHalf = containerRef.current
    ? containerRef.current.getBoundingClientRect().bottom
        > window.innerHeight / 2
    : !!containerRef.current;

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
        // tabIndex={0}
        onClick={onClickSelector}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpen,
        })}
        disabled={disabled}
      >
        {showLabel}
        <DownArrowIcon />
      </button>

      {isOpen && (
        <ul
          className={cn({
            [styles['select__contents-list']]: true,
            [styles['select__contents-list--up']]: isOverHalf,
            [styles['select__contents-list--visible']]: isOpen,
          })}
          role="listbox"
        >
          {options.map((option) => (
            <li
              className={styles.select__content}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOptionClick(option.value);
                  e.preventDefault();
                }
              }}
            >
              <span>{option.label}</span>
              {type === 'delete' && (
                <button
                  type="button"
                  className={styles.select__button}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(option.value);
                  }}
                >
                  <TrashCanIcon />
                  <div>삭제</div>
                </button>
              )}
              {type === 'setting' && (
                <button
                  type="button"
                  className={styles.select__button}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSettingsClick?.(option.value);
                  }}
                >
                  <SettingIcon />
                  <div>설정</div>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
