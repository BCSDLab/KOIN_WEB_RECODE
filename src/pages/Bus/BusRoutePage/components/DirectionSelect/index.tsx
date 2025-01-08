import { Arrival, Depart } from 'api/bus/entity';
import ExchangeIconMobile from 'assets/svg/Bus/exchange-icon-mobile.svg';
import ExchangeIcon from 'assets/svg/Bus/exchange-icon.svg';
import PlaceSelect from 'pages/Bus/BusRoutePage/components/PlaceSelect';
import { LOCATION_TYPE_KEY } from 'pages/Bus/BusRoutePage/constants/location';
import { useBusLogger } from 'pages/Bus/hooks/useBusLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import { useEffect } from 'react';
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
  depart,
  setDepart,
  arrival,
  setArrival,
  isSearching,
  lookUp,
}: DirectionSelectProps) {
  const isMobile = useMediaQuery();

  const {
    logDepartureBoxClick,
    logDepartureLocationConfirm,
    logArrivalBoxClick,
    logArrivalLocationConfirm,
    logSwapDestinationClick,
  } = useBusLogger();

  const exchangePlace = () => {
    const temp = depart;
    setDepart(arrival);
    setArrival(temp);
    logSwapDestinationClick();
  };

  useEffect(() => {
    if (isMobile && depart && arrival) lookUp();
  }, [isMobile, depart, arrival, lookUp]);

  return (
    <div className={styles.container}>
      <div
        className={cn({
          [styles.box]: true,
          [styles['box--searching']]: isSearching,
        })}
      >
        <div className={styles.direction}>
          <PlaceSelect
            type={LOCATION_TYPE_KEY.depart}
            place={depart}
            oppositePlace={arrival}
            setPlace={setDepart}
            exchangePlace={exchangePlace}
            logBoxClick={logDepartureBoxClick}
            logConfirmClick={logDepartureLocationConfirm}
          />
          <button
            className={styles['exchange-button']}
            onClick={() => exchangePlace()}
            type="button"
            aria-label="출발지와 도착지를 바꾸기"
          >
            {isMobile ? (
              <ExchangeIconMobile aria-hidden="true" />
            ) : (
              <ExchangeIcon aria-hidden="true" />
            )}
          </button>
          <PlaceSelect
            type={LOCATION_TYPE_KEY.arrival}
            place={arrival}
            oppositePlace={depart}
            setPlace={setArrival}
            exchangePlace={exchangePlace}
            logBoxClick={logArrivalBoxClick}
            logConfirmClick={logArrivalLocationConfirm}
          />
        </div>
        {!isMobile && !isSearching && (
          <button className={styles['lookup-button']} onClick={lookUp} type="button">
            조회하기
          </button>
        )}
      </div>
    </div>
  );
}
