import { useEffect, useRef, useState } from 'react';
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
  options: Option[];
  initialOption: string;
  setValue: (value: number) => void;
}

export default function SelectDropdown({
  type, options, initialOption, setValue,
}: SelectDropdownProps) {
  const [isOpen,, setClose, toggleOpen] = useBooleanState(false);
  const [selectedOption, setSelectedOption] = useState(initialOption);
  const { containerRef } = useOutsideClick({ onOutsideClick: setClose });
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  useEscapeKeyDown({ onEscape: setClose });

  const handleOptionSelect = (option: string, value: number) => {
    setValue(value);
    setSelectedOption(option);
    setClose();
  };

  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      const selectedElement = selectedItemRef.current;

      selectedElement.scrollIntoView({
        block: 'center',
        behavior: 'auto',
      });
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
      <ChevronLeft />
      <button
        type="button"
        className={styles.selector}
        onClick={() => toggleOpen()}
      >
        <span className={styles.selector__text}>{selectedOption}</span>
      </button>
      <ChevronRight />
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map(({ label, value }) => (
            <button
              key={label}
              ref={label === initialOption ? selectedItemRef : null}
              className={cn({
                [styles.option]: true,
                [styles['option--selected']]: label === selectedOption,
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
