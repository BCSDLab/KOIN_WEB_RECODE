import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import ChevronLeft from 'assets/svg/Bus/chevron-left.svg';
import ChevronRight from 'assets/svg/Bus/chevron-right.svg';
import styles from './SelectDropdown.module.scss';

interface ValueType {
  date?: number;
  hour?: number;
  minute?: number;
  enable: boolean;
  label: string;
}

interface SelectDropdownProps {
  type: 'left' | 'middle' | 'right';
  values: ValueType[];
  selectedValue: number;
  setSelectedValue: (value: number) => void;
}

export default function SelectDropdown({
  type, values, selectedValue, setSelectedValue,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const getValue = (value: ValueType) => {
    if ('date' in value && value.date) return value.date;
    if ('hour' in value && value.hour) return value.hour;
    if ('minute' in value && value.minute) return value.minute;
    return 0;
  };

  const selectedLabel = type === 'right'
    ? `${selectedValue}분`
    : values.find((value) => getValue(value) === selectedValue)?.label || '';

  return (
    <div
      className={cn({
        [styles.box]: true,
        [styles[`box--${type}`]]: true,
      })}
    >
      <ChevronLeft />
      <button
        type="button"
        className={styles.selector}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selector__text}>{selectedLabel}</span>
      </button>
      <ChevronRight />
      {isOpen && (
        <div className={styles.dropdown}>
          {values.map((value) => (
            <button
              key={getValue(value)}
              className={cn({
                [styles.option]: true,
                [styles['option--selected']]: getValue(value) === selectedValue,
                [styles['option--disabled']]: !value.enable,
              })}
              onClick={() => {
                if (value.enable) {
                  setSelectedValue(getValue(value));
                  setIsOpen(false);
                }
              }}
              disabled={!value.enable}
              type="button"
            >
              {value.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
