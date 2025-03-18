import { useState } from 'react';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import MobileCafeteriaPage from 'pages/Cafeteria/MobileCafeteriaPage';
import { DiningType } from 'api/dinings/entity';
import { DiningTime } from 'pages/Cafeteria/utils/time';
import PCCafeteriaPage from './PCCafeteriaPage';
import { useDatePicker } from './hooks/useDatePicker';
import styles from './Cafeteria.module.scss';

function CafeteriaPage() {
  const isMobile = useMediaQuery();
  const [diningType, setDiningType] = useState<DiningType>(new DiningTime().getType());
  const { currentDate } = useDatePicker();

  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate().toISOString()}>
        {isMobile
          ? (
            <MobileCafeteriaPage
              diningType={diningType}
              setDiningType={setDiningType}
            />
          ) : (
            <PCCafeteriaPage
              diningType={diningType}
              setDiningType={setDiningType}
            />
          )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
