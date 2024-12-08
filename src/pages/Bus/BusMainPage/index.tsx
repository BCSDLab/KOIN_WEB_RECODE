import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import BusNotice from 'pages/Bus/BusMainPage/components/BusNotice';
import DirectionSelect from 'pages/Bus/BusMainPage/components/DirectionSelect';
import BusLookup from 'pages/Bus/BusMainPage/components/BusLookup';
import { useState } from 'react';
import styles from './BusMainPage.module.scss';

function BusMainPage() {
  const [direction, setDirection] = useState({ depart: '', arrival: '' });
  const [isSelecting, setIsSelecting] = useState(true);

  const getRoute = () => {
    // mutate 함수
    setIsSelecting(true);
  };

  useScrollToTop();

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.guide}>
          <h1 className={styles.guide__title}>버스</h1>
          <p className={styles.guide__description}>목적지까지 가장 빠른 교통편을 알려드릴게요.</p>
        </div>
        {isSelecting ? (
          <div className={styles.contents}>
            <BusNotice />
            <DirectionSelect onDirectionChange={setDirection} />
          </div>
        ) : (
          <div className={styles.contents}>
            <BusLookup depart={direction.depart} arrival={direction.arrival} />
          </div>
        )}
      </div>
    </main>
  );
}

export default BusMainPage;
