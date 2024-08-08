import React from 'react';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './Listbox.module.scss';

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
}

function Listbox({
  list,
  value,
  onChange,
  logTitle = '',
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

  const onClickOption = (event: React.MouseEvent<HTMLLIElement>) => {
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
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
  return (
    <div
      className={styles.select}
      ref={wrapperRef}
    >
      <button
        type="button"
        onClick={triggerPopup}
        className={cn({
          [styles.select__trigger]: true,
        })}
      >
        {value !== null ? list.find((item) => item.value === value)?.label : ''}
      </button>
      {isOpenedPopup && (
        <ul className={styles.select__content} role="listbox">
          {list.map((optionValue) => (
            <li
              className={styles.select__option}
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
};

export default Listbox;
