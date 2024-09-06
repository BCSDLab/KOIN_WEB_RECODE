import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as DownArrowIcon } from 'assets/svg/down-arrow-icon.svg';
import { ReactComponent as UpArrowIcon } from 'assets/svg/up-arrow-icon.svg';
import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useLogger from 'utils/hooks/analytics/useLogger';
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
  list: ListItem[];
  value: string | null;
  onChange: (event: { target: ListboxRef }) => void;
  logTitle?: string;
  version?: 'default' | 'new' | 'inModal' | 'addLecture';
}

function Listbox({
  list,
  value,
  onChange,
  logTitle = '',
  version = 'default',
}: ListboxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const logger = useLogger();
  const handleLogClick = (optionValue: string) => {
    if (logTitle === 'select_dept') {
      logger.actionEventClick({ actionTitle: 'USER', title: 'select_dept', value: optionValue });
      return;
    }
    if (logTitle === 'select_semester') {
      logger.actionEventClick({ actionTitle: 'USER', title: 'select_semester', value: optionValue });
    }
  };

  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };

  const onClickOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    onChange({ target: { value: optionValue ?? '' } });
    handleLogClick(optionValue ?? '');
    closePopup();
  };
  const { target } = useOnClickOutside<HTMLDivElement>(closePopup);
  const styleClasses = version !== 'default' ? newStyles : styles;
  return (
    <div
      className={styleClasses.select}
      ref={target}
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
      >
        {value !== null ? list.find((item) => item.value === value)?.label : '학부'}
        {version !== 'default' && (isOpenedPopup ? <UpArrowIcon /> : <DownArrowIcon />)}
      </button>
      {isOpenedPopup && (
        <ul className={styleClasses.select__content} role="listbox">
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

Listbox.defaultProps = {
  logTitle: '',
  version: 'default',
};

export default Listbox;
