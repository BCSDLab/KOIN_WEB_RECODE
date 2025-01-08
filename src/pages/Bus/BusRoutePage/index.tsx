import { Arrival, BusTypeRequest, Depart } from 'api/bus/entity';
import BusGuide from 'pages/Bus/BusRoutePage/components/BusGuide';
import BusSearchOptions from 'pages/Bus/BusRoutePage/components/BusSearchOptions';
import DirectionSelect from 'pages/Bus/BusRoutePage/components/DirectionSelect';
import RouteList from 'pages/Bus/BusRoutePage/components/RouteList';
import { useTimeSelect } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import BusNotice from 'pages/Bus/components/BusNotice';
import { useBusLogger } from 'pages/Bus/hooks/useBusLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { Suspense, useState } from 'react';
import styles from './BusRoutePage.module.scss';

export default function BusRoutePage() {
  const isMobile = useMediaQuery();
  const timeSelect = useTimeSelect();
  const [busType, setBusType] = useState<BusTypeRequest>('ALL');
  const [depart, setDepart] = useState<Depart | ''>('');
  const [arrival, setArrival] = useState<Arrival | ''>('');
  const [isLookingUp, startLookingUp] = useBooleanState(false);
  const { logSearchBusClick } = useBusLogger();

  const lookUp = () => {
    if (!depart || !arrival) return;
    startLookingUp();
    logSearchBusClick();
  };

  useScrollToTop();

  return (
    <main>
      <div className={styles.container}>
        {!isMobile && <BusGuide />}
        <div className={styles.place}>
          <BusNotice />
          <DirectionSelect
            depart={depart}
            setDepart={setDepart}
            arrival={arrival}
            setArrival={setArrival}
            isSearching={isLookingUp}
            lookUp={lookUp}
          />
        </div>
        {isLookingUp && (
          <div className={styles.results}>
            <div className={styles.options}>
              <BusSearchOptions busType={busType} setBusType={setBusType} timeSelect={timeSelect} />
            </div>
            <Suspense fallback={<div className={styles.fallback} />}>
              <div className={styles['route-list']}>
                <RouteList
                  timeSelect={timeSelect}
                  busType={busType}
                  depart={depart as Depart}
                  arrival={arrival as Arrival}
                />
              </div>
            </Suspense>
          </div>
        )}
      </div>
    </main>
  );
}
