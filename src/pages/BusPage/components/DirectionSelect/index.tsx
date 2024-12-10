import { cn } from '@bcsdlab/utils';
import ExchangeIcon from 'assets/svg/Bus/exchange-icon.svg';
import PlaceSelect from 'pages/BusPage/components/PlaceSelect';
import { placeTypeKeys } from 'pages/BusPage/ts/placeModules';
import { useEffect, useState } from 'react';
import styles from './DirectionSelect.module.scss';

interface DirectionSelectProps {
  onDirectionChange: (direction: { depart: string; arrival: string }) => void;
  isSearching: boolean,
  getRoute: () => void,
}

export default function DirectionSelect({
  onDirectionChange, isSearching, getRoute,
}: DirectionSelectProps) {
  const [depart, setDepart] = useState('');
  const [arrival, setArrival] = useState('');

  useEffect(() => {
    onDirectionChange?.({ depart, arrival });
  }, [depart, arrival, onDirectionChange]);

  const exchangePlace = () => {
    const temp = depart;
    setDepart(arrival);
    setArrival(temp);
  };

  const handleLookupClick = () => {
    getRoute();
  };

  return (
    <div className={styles.container}>
      <div
        className={cn({
          [styles.box]: true,
          [styles['box--searching']]: isSearching,
        })}
      >
        <div className={styles.direction}>
          <div className={styles.direction_select}>
            <PlaceSelect
              type={placeTypeKeys.depart}
              place={depart}
              oppositePlace={arrival}
              setPlace={setDepart}
              exchangePlace={exchangePlace}
              isSearching={isSearching}
            />
          </div>
          <button
            className={styles['exchange-button']}
            onClick={() => exchangePlace()}
            type="button"
            aria-label="출발지와 도착지를 바꾸기"
          >
            <ExchangeIcon aria-hidden="true" />
          </button>
          <div className={styles.direction_select}>
            <PlaceSelect
              type={placeTypeKeys.arrival}
              place={arrival}
              oppositePlace={depart}
              setPlace={setArrival}
              exchangePlace={exchangePlace}
              isSearching={isSearching}
            />
          </div>
        </div>
        {!isSearching && (
          <button
            className={styles['lookup-button']}
            onClick={handleLookupClick}
            type="button"
          >
            조회하기
          </button>
        )}
      </div>
    </div>
  );
}
