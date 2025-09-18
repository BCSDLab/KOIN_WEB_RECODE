import { cn } from '@bcsdlab/utils';
import { DepartArrivalPlace } from 'api/bus/entity';
import {
  locationLabels, locations, LOCATION_MAP, REVERSE_LOCATION_MAP,
} from 'components/Bus/BusRoutePage/constants/location';
import { LocationDisplay } from 'components/Bus/BusRoutePage/ts/types';
import { LoggingLocation } from 'components/Bus/hooks/useBusLogger';
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
  logBoxClick: VoidFunction;
  logConfirmClick: (location: LoggingLocation) => void;
}

export default function PlaceSelect({
  type, place, setPlace, exchangePlace, oppositePlace, logBoxClick, logConfirmClick,
}: PlaceSelectProps) {
  const locationLabel = locationLabels[type];
  const [dropdownOpen, , closeDropdown, toggleDropdown] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closeDropdown });

  const handleSelectBoxClick = () => {
    toggleDropdown();
    logBoxClick();
  };

  const handleDropdownItemClick = (locationName: LocationDisplay) => {
    logConfirmClick(locationName);
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
          className={cn({
            [styles['select-box']]: true,
            [styles['select-box--empty']]: !place,
          })}
          onClick={handleSelectBoxClick}
          type="button"
        >
          <span
            className={styles['select-box__text']}
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
