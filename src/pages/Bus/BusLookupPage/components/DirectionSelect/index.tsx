import ExchangeIcon from 'assets/svg/Bus/exchange-icon.svg';
import PlaceSelect from 'pages/Bus/BusLookupPage/components/PlaceSelect';
import { useEffect, useState } from 'react';
import styles from './DirectionSelect.module.scss';

const PLACE_TYPE_KEYS = {
  depart: 'depart',
  arrival: 'arrival',
} as const;

interface DirectionSelectProps {
  onDirectionChange: (direction: { depart: string; arrival: string }) => void;
}

export default function DirectionSelect({ onDirectionChange }: DirectionSelectProps) {
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

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.direction}>
          <div className={styles.direction_select}>
            <PlaceSelect
              type={PLACE_TYPE_KEYS.arrival}
              place={depart}
              oppositePlace={arrival}
              setPlace={setDepart}
              exchangePlace={exchangePlace}
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
              type={PLACE_TYPE_KEYS.arrival}
              place={arrival}
              oppositePlace={depart}
              setPlace={setArrival}
              exchangePlace={exchangePlace}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
