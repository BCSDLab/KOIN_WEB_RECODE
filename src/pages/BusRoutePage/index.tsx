import { Suspense, useState } from 'react';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import BusNotice from 'pages/BusRoutePage/components/BusNotice';
import DirectionSelect from 'pages/BusRoutePage/components/DirectionSelect';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { Arrival, BusTypeRequest, Depart } from 'api/bus/entity';
import BusGuide from 'pages/BusRoutePage/components/BusGuide';
import RouteList from './components/RouteList';
import BusSearchOptions from './components/BusSearchOptions';
import { useTimeSelect } from './hooks/useTimeSelect';
import styles from './BusRoutePage.module.scss';

export default function BusRoutePage() {
  const timeSelect = useTimeSelect();
  const [busType, setBusType] = useState<BusTypeRequest>('ALL');
  const [depart, setDepart] = useState<Depart | ''>('');
  const [arrival, setArrival] = useState<Arrival | ''>('');
  const [isLookingUp, startLookingUp] = useBooleanState(false);

  const lookUp = () => {
    if (!depart || !arrival) return;
    startLookingUp();
  };

  useScrollToTop();

  return (
    <main>
      <div className={styles.container}>
        <BusGuide />
        <div className={styles.place}>
          <BusNotice isSearching={isLookingUp} />
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
              <BusSearchOptions
                busType={busType}
                setBusType={setBusType}
                timeSelect={timeSelect}
              />
            </div>
            <Suspense fallback={(<div>d</div>)}>
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
