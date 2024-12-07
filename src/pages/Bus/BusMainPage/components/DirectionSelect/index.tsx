import ExchangeIcon from 'assets/svg/Bus/exchange-icon.svg';
import PlaceSelect from 'pages/Bus/BusMainPage/components/PlaceSelect';
import { useState } from 'react';
import styles from './DirectionSelect.module.scss';

const PLACE_TYPE_KEYS = {
  departure: 'departure',
  destination: 'destination',
} as const;

export default function DirectionSelect() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const exchangePlace = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.direction}>
          <div className={styles.direction_select}>
            <PlaceSelect
              type={PLACE_TYPE_KEYS.departure}
              place={departure}
              oppositePlace={destination}
              setPlace={setDeparture}
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
              type={PLACE_TYPE_KEYS.destination}
              place={destination}
              oppositePlace={departure}
              setPlace={setDestination}
              exchangePlace={exchangePlace}
            />
          </div>
        </div>
        <button
          className={styles['submit-button']}
          type="button"
        >
          조회하기
        </button>
      </div>
    </div>
  );
}
