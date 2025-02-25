import React from 'react';
import { cn } from '@bcsdlab/utils';
import ChervronUpDown from 'assets/svg/chervron-up-down.svg';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './Listbox.module.scss';
import newStyles from './NewListbox.module.scss';

export interface ListboxRef {
  value: string;
}

export interface ListItem {
  label: string;
  value: string;
}

export interface ListboxProps {
  list: readonly ListItem[];
  value: string | null;
  onChange: (event: { target: ListboxRef }) => void;
  version?: 'default' | 'new' | 'inModal' | 'addLecture';
  disabled?: boolean;
}

function Listbox({
  list,
  value,
  onChange,
  version = 'default',
  disabled = false,
}: ListboxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);

  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };

  const onClickOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    onChange({ target: { value: optionValue ?? '' } });
    closePopup();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: closePopup });

  const isOverHalf = containerRef.current
    ? containerRef.current.getBoundingClientRect().bottom
    > window.innerHeight / 2
    : !!containerRef.current;
  const styleClasses = version !== 'default' ? newStyles : styles;

  return (
    <div
      className={styleClasses.select}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={handleToggleListBox}
        className={cn({
          [styleClasses.select__trigger]: true,
          [styleClasses['select__trigger--selected']]: isOpenedPopup && version === 'new',
          [styleClasses['select__trigger--selected-in-modal']]: version === 'inModal',
          [styleClasses['select__trigger--selected-in-modal--opened']]: isOpenedPopup && version === 'inModal',
          [styleClasses['select__trigger--selected-add-lecture']]: version === 'addLecture',
          [styleClasses['select__trigger--selected-add-lecture--opened']]: isOpenedPopup && version === 'addLecture',
        })}
        disabled={disabled}
      >
        {value === null ? '학부' : list.find((item) => item.value === value)?.label}
        {version === 'default' ? <ChervronUpDown /> : <DownArrowIcon />}
      </button>
      {isOpenedPopup && (
        <ul
          className={
            cn({
              [styleClasses.select__content]: true,
              [styleClasses['select__content--up']]: isOverHalf,
            })
          }
          role="listbox"
        >
          {list.map((optionValue) => (
            <button
              type="button"
              className={cn({
                [styleClasses.select__option]: true,
                [styleClasses['select__option--add-lecture']]: version === 'addLecture',
                [styleClasses['select__option--selected']]: optionValue.value === value,
                [styleClasses['select__option--selected-add-lecture']]: optionValue.value === value,
              })}
              key={optionValue.value}
              role="option"
              aria-selected={optionValue.value === value}
              data-value={optionValue.value}
              onClick={onClickOption}
              tabIndex={0}
            >
              {optionValue.label}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Listbox;
