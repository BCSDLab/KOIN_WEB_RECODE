import { useState } from 'react';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import BusNotice from 'pages/BusPage/components/BusNotice';
import DirectionSelect from 'pages/BusPage/components/DirectionSelect';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import BusGuide from 'pages/BusPage/components/BusGuide';
import styles from './BusPage.module.scss';

export default function BusPage() {
  const [direction, setDirection] = useState({ depart: '', arrival: '' });
  const [isSearching, startSearch] = useBooleanState(false);

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
        <div className={styles.contents}>
          <BusNotice />
          <DirectionSelect
            onDirectionChange={setDirection}
            isSearching={isSearching}
            getRoute={getRoute}
          />
        </div>
      </div>
    </main>
  );
}
