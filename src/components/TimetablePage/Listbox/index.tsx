import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as LowerArrow } from 'assets/svg/lower-angle-bracket.svg';
import { ReactComponent as UpperArrow } from 'assets/svg/upper-angle-bracket.svg';
import useBooleanState from 'utils/hooks/useBooleanState';
import { ReactComponent as DownArrowIcon } from 'assets/svg/down-arrow-icon.svg';
import { ReactComponent as UpArrowIcon } from 'assets/svg/up-arrow-icon.svg';
import useLogger from 'utils/hooks/useLogger';
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
  version?: 'default' | 'new';
}

function Listbox({
  list,
  value,
  onChange,
  logTitle = '',
  version = 'default',
}: ListboxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
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

  const onClickOption = (event: React.MouseEvent<HTMLLIElement>) => {
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    event.stopPropagation();
    onChange({ target: { value: optionValue ?? '' } });
    handleLogClick(optionValue ?? '');
    closePopup();
  };
  const onKeyPressOption = (event: React.KeyboardEvent<HTMLLIElement>) => {
    const { key, currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    switch (key) {
      case 'Enter':
        onChange({ target: { value: optionValue ?? '' } });
        closePopup();
        break;
      default:
        break;
    }
  };
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const { target } = event;
      if (wrapperRef.current && target && !wrapperRef.current.contains(target as HTMLElement)) {
        closePopup();
      }
    }
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

  const styleClasses = version === 'new' ? newStyles : styles;
  return (
    <div
      className={styleClasses.select}
      ref={wrapperRef}
    >
      <button
        type="button"
        onClick={handleToggleListBox}
        className={cn({
<<<<<<< HEAD
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpenedPopup,
        })}
      >
        {value !== null ? list.find((item) => item.value === value)?.label : ''}
        {isOpenedPopup ? <UpperArrow /> : <LowerArrow />}
=======
          [styleClasses.select__trigger]: true,
          [styleClasses['select__trigger--selected']]: isOpenedPopup,
        })}
      >
        {value !== null ? list.find((item) => item.value === value)?.label : ''}
        {version === 'new' && (isOpenedPopup ? <UpArrowIcon /> : <DownArrowIcon />)}
>>>>>>> develop
      </button>
      {isOpenedPopup && (
        <ul className={styleClasses.select__content} role="listbox">
          {list.map((optionValue) => (
            <li
              className={cn({
                [styleClasses.select__option]: true,
                [styleClasses['select__option--selected']]: optionValue.value === value,
              })}
              key={optionValue.value}
              role="option"
              aria-selected={optionValue.value === value}
              data-value={optionValue.value}
              onClick={onClickOption}
              onKeyPress={onKeyPressOption}
              tabIndex={0}
            >
              {optionValue.label}
            </li>
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
