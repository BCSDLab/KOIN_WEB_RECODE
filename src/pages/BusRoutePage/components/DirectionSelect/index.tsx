import { cn } from '@bcsdlab/utils';
import { Arrival, Depart } from 'api/bus/entity';
import ExchangeIcon from 'assets/svg/Bus/exchange-icon.svg';
import PlaceSelect from 'pages/BusRoutePage/components/PlaceSelect';
import { LOCATION_TYPE_KEY } from 'pages/BusRoutePage/constants/location';
import styles from './DirectionSelect.module.scss';

interface DirectionSelectProps {
  depart: Depart | '';
  setDepart: (depart: Depart | '') => void;
  arrival: Arrival | '';
  setArrival: (arrival: Arrival | '') => void;
  isSearching: boolean;
  lookUp: () => void;
}

export default function DirectionSelect({
  depart, setDepart, arrival, setArrival, isSearching, lookUp,
}: DirectionSelectProps) {
  const exchangePlace = () => {
    const temp = depart;
    setDepart(arrival);
    setArrival(temp);
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
              type={LOCATION_TYPE_KEY.depart}
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
              type={LOCATION_TYPE_KEY.arrival}
              place={arrival}
              oppositePlace={depart}
              setPlace={setArrival}
              exchangePlace={exchangePlace}
            />
          </div>
        </div>
        {!isSearching && (
          <button
            className={styles['lookup-button']}
            onClick={lookUp}
            type="button"
          >
            조회하기
          </button>
        )}
      </div>
    </div>
  );
}
