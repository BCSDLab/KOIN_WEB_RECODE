import React from 'react';
import cn from 'utils/ts/classnames';
import useBooleanState from 'utils/hooks/useBooleanState';
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
}

function Listbox({
  list,
  value,
  onChange,
}: ListboxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const onClickOption = (event: React.MouseEvent<HTMLLIElement>) => {
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    onChange({ target: { value: optionValue ?? '' } });
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

export default Listbox;
