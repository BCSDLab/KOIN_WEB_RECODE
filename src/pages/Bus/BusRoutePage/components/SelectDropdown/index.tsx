import { useEffect, useRef } from 'react';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ChevronLeft from 'assets/svg/Bus/chevron-left.svg';
import ChevronRight from 'assets/svg/Bus/chevron-right.svg';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './SelectDropdown.module.scss';

interface Option {
  label: string;
  value: number;
}

interface SelectDropdownProps {
  type: 'dayOfMonth' | 'hour' | 'minute';
  options: Array<Option>;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  setValue: (value: number) => void;
}

export default function SelectDropdown({
  type, options, selectedLabel, setSelectedLabel, setValue,
}: SelectDropdownProps) {
  const [isOpen,, setClose, toggleOpen] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: setClose });
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEscapeKeyDown({ onEscape: setClose });

  const handleOptionSelect = (label: string, value: number) => {
    setValue(value);
    setSelectedLabel(label);
    setClose();
  };

  const handleArrowClick = (direction: 'left' | 'right') => {
    let currentIndex = options.findIndex(({ label }) => label === selectedLabel);
    if (currentIndex === -1) {
      const numericPart = parseInt(selectedLabel.replace(/\D/g, ''), 10); // 분 단위의 경우 '분'을 제외한 숫자만 추출
      currentIndex = Math.floor(numericPart / 10);
    }

    const nextIndex = direction === 'left'
      ? Math.max(currentIndex - 1, 0)
      : Math.min(currentIndex + 1, options.length - 1);
    const nextOption = options[nextIndex];

    setValue(nextOption.value);
    setSelectedLabel(nextOption.label);
  };

  useEffect(() => {
    if (isOpen && selectedItemRef.current && dropdownRef.current) {
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const selectedElement = selectedItemRef.current;
      const selectedOffset = selectedElement.offsetTop;
      const selectedHeight = selectedElement.offsetHeight;

      dropdownRef.current.scrollTop = selectedOffset - (dropdownHeight / 2) + (selectedHeight / 2);
    }
  }, [isOpen]);

  return (
    <div
      className={cn({
        [styles.box]: true,
        [styles[`box--${type}`]]: true,
      })}
      ref={containerRef}
    >
      <button
        type="button"
        className={styles.arrow}
        onClick={() => handleArrowClick('left')}
        aria-label="이전"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        className={styles.selector}
        onClick={() => toggleOpen()}
      >
        <span className={styles.selector__text}>{selectedLabel}</span>
      </button>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => handleArrowClick('right')}
        aria-label="다음"
      >
        <ChevronRight />
      </button>
      {isOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          {options.map(({ label, value }) => (
            <button
              key={label}
              ref={label === selectedLabel ? selectedItemRef : null}
              className={cn({
                [styles.option]: true,
                [styles['option--selected']]: label === selectedLabel,
              })}
              onClick={() => handleOptionSelect(label, value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
