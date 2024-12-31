import { cn } from '@bcsdlab/utils';
import { DepartArrivalPlace } from 'api/bus/entity';
import {
  locationLabels, locations, LOCATION_MAP, REVERSE_LOCATION_MAP,
} from 'pages/Bus/BusRoutePage/constants/location';
import { LocationDisplay } from 'pages/Bus/BusRoutePage/ts/types';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './PlaceSelect.module.scss';

interface PlaceSelectProps {
  type: keyof typeof locationLabels;
  place: DepartArrivalPlace | '';
  setPlace: (value: DepartArrivalPlace) => void;
  exchangePlace: () => void;
  oppositePlace: DepartArrivalPlace | '';
}

export default function PlaceSelect({
  type, place, setPlace, exchangePlace, oppositePlace,
}: PlaceSelectProps) {
  const locationLabel = locationLabels[type];
  const [dropdownOpen, , closeDropdown, toggleDropdown] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closeDropdown });

  const handleDropdownItemClick = (locationName: LocationDisplay) => {
    const currentLocation = REVERSE_LOCATION_MAP[locationName];
    if (oppositePlace === currentLocation) {
      exchangePlace();
      closeDropdown();
      return;
    }

    setPlace(currentLocation);
    closeDropdown();
  };

  useEscapeKeyDown({ onEscape: closeDropdown });

  return (
    <div className={styles.box}>
      <h1 className={styles.title}>{locationLabel.title}</h1>
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
            {place ? LOCATION_MAP[place] : locationLabel.placeholder}
          </span>
        </button>
        {dropdownOpen && (
          <div className={styles.dropdown}>
            {locations.map((location) => (
              <button
                className={styles.dropdown__option}
                onClick={() => handleDropdownItemClick(location)}
                type="button"
                key={location}
              >
                <span className={styles.dropdown__text}>{location}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
