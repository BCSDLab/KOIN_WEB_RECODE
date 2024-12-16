import { cn } from '@bcsdlab/utils';
import { places, placeType } from 'pages/BusRoutePage/ts/placeModules';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './PlaceSelect.module.scss';

interface PlaceSelectProps {
  type: keyof typeof placeType;
  place: string;
  setPlace: (value: string) => void;
  exchangePlace: () => void;
  oppositePlace: string;
}

export default function PlaceSelect({
  type, place, setPlace, exchangePlace, oppositePlace,
}: PlaceSelectProps) {
  const typeInfo = placeType[type];
  const [dropdownOpen, , closeDropdown, toggleDropdown] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closeDropdown });

  const handleDropdownItemClick = (name: string) => {
    if (oppositePlace === name) {
      exchangePlace();
      closeDropdown();
      return;
    }

    setPlace(name);
    closeDropdown();
  };

  useEscapeKeyDown({ onEscape: closeDropdown });

  return (
    <div className={styles.box}>
      <h1 className={styles.title}>{typeInfo.title}</h1>
      <div ref={containerRef}>
        <button
          className={styles['select-box']}
          onClick={toggleDropdown}
          type="button"
        >
          <span
            className={cn({
              [styles['select-box__text']]: true,
              [styles['select-box__text--empty']]: !place,
            })}
          >
            {place || typeInfo.placeholder}
          </span>
        </button>
        {dropdownOpen && (
          <div className={styles.dropdown}>
            {places.map((name) => (
              <button
                className={styles.dropdown__item}
                onClick={() => handleDropdownItemClick(name)}
                type="button"
                key={name}
              >
                <span className={styles.dropdown__text}>{name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
