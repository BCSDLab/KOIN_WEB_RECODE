import { cn } from '@bcsdlab/utils';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import TrashCanIcon from 'assets/svg/trash-can-icon.svg';
import SettingIcon from 'assets/svg/setting-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './Selector.module.scss';

type SelectorType = 'delete' | 'setting' | 'default';
type SelectorVersion = 'default' | 'inSignup' | 'inTimetable' | 'inModify';

interface OptionList {
  label: string;
  value: string;
}
interface SelectorProps {
  options: OptionList[];
  value: string | null;
  type?: SelectorType;
  version?: SelectorVersion;
  placeholder?: string;
  disabled?: boolean;
  // onChange: React.Dispatch<React.SetStateAction<string | null>>;
  onChange: (event: { target: { value: string } }) => void;
  onDelete?: (value: string) => void;
  onSettingsClick?: (value: string) => void;
}

export function Selector({
  options,
  value,
  type = 'default',
  version = 'inSignup',
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
    // onChange(optionValue);
    onChange({ target: { value: optionValue } });
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
          [styles['select__trigger--in-signup']]: version === 'inSignup',
          [styles['select__trigger--in-modify']]: version === 'inModify',
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
            // [styles['select__contents-list--in-signup']]: version === 'inSignup',
          })}
          role="listbox"
        >
          {options.map((option) => (
            <li
              // tabIndex={0}
              role="option"
              key={option.value}
              className={cn({
                [styles.select__content]: true,
                [styles['select__content--in-signup']]: version === 'inSignup',
              })}
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
