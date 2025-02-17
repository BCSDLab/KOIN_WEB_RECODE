import { useState, useRef, useEffect } from 'react';
import { cn } from '@bcsdlab/utils';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import TrashCanIcon from 'assets/svg/trash-can-icon.svg';
import SettingIcon from 'assets/svg/setting-icon.svg';
import styles from './Selector.module.scss';

type SelectorType = 'delete' | 'settings' | 'default';

type SelectorProps<T> = {
  options: { label: string; value: T }[];
  value: number | null;
  onChange: (value: T) => void;
  placeholder?: string;
  type: SelectorType;
  onDelete?: (value: T) => void;
  onSettingsClick?: (value: T) => void;
};

export function Selector<T>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  type = 'default',
  onDelete,
  onSettingsClick,
}: SelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen((prev) => !prev);
      event.preventDefault();
    }
  };

  return (
    <div
      ref={selectorRef}
      className={cn({
        [styles.select]: true,
        [styles['select--opened']]: isOpen,
      })}
    >
      <button
        type="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpen,
        })}
      >
        {value
          ? options.find((option) => option.value === value)?.label
          : placeholder}
        <DownArrowIcon />
      </button>

      {isOpen && (
        <ul className={styles['select__contents-list']} role="listbox">
          {options.map((option) => (
            <li
              key={String(option.value)}
              className={styles.select__content}
              role="option"
              tabIndex={0}
              aria-selected={option.value === value}
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
              {type === 'settings' && (
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
