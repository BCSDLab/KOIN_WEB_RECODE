import { useState } from 'react';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import BusNotice from 'pages/BusRoutePage/components/BusNotice';
import DirectionSelect from 'pages/BusRoutePage/components/DirectionSelect';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import BusGuide from 'pages/BusRoutePage/components/BusGuide';
import RouteList from './components/RouteList';
import BusSearchOptions from './components/BusSearchOptions';
import styles from './BusRoutePage.module.scss';

// "bus_type": "city",
// "route_name": "400",
// "depart_time": "16:56"

export default function BusRoutePage() {
  const [direction, setDirection] = useState({ depart: '', arrival: '' });
  const [isSearching, startSearch] = useBooleanState(false);
  const [departTime, setDepartTime] = useState(0);
  console.log(departTime, setDepartTime);

  const getRoute = () => {
    // mutate 함수
    startSearch();
  };
  console.log(direction, isSearching, getRoute);

  useScrollToTop();

  return (
    <main>
      <div className={styles.container}>
        <BusGuide />
        <div className={styles.place}>
          <BusNotice isSearching={isSearching} />
          <DirectionSelect
            onDirectionChange={setDirection}
            isSearching={isSearching}
            getRoute={getRoute}
          />
        </div>
        {isSearching && (
          <div className={styles.results}>
            <div className={styles.options}>
              <BusSearchOptions />
            </div>
            <div className={styles['route-list']}>
              <RouteList />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
