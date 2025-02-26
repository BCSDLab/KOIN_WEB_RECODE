import { cn } from '@bcsdlab/utils';
// import SettingIcon from 'assets/svg/setting-icon.svg';
// import TrashCanIcon from 'assets/svg/trash-can-icon.svg';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './Selector.module.scss';

interface OptionList {
  label: string;
  value: string;
}
interface SelectorProps {
  options: OptionList[];
  value: string | null;
  isWhiteBackground?: boolean;
  // type?: SelectorType;
  placeholder?: string;
  // disabled?: boolean;
  DetailIcon?: React.ComponentType;
  // onDelete?: (value: string) => void;
  // onSettingsClick?: (value: string) => void;
  onChange: (event: { target: { value: string } }) => void;
}

export function Selector({
  options,
  value,
  isWhiteBackground = true,
  // type = 'default',
  placeholder = '선택해주세요.',
  // disabled = false,
  DetailIcon,
  // onDelete,
  // onSettingsClick,
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
        onClick={onClickSelector}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpen,
          [styles['select__trigger--white-background']]: isWhiteBackground,
        })}
      >
        {showLabel}
        <DownArrowIcon />
      </button>

      {isOpen && (
        <ul
          className={cn({
            [styles['select__contents-list']]: true,
            [styles['select__contents-list--up']]: isOverHalf,
          })}
          role="listbox"
        >
          {options.map((option) => (
            <li
              role="option"
              key={option.value}
              className={cn({
                [styles.select__content]: true,
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
              {DetailIcon && (
                <DetailIcon />
              )}
              {/*
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
                */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
