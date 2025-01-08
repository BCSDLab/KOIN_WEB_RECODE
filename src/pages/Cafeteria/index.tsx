import MobileCafeteriaPage from 'pages/Cafeteria/MobileCafeteriaPage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { DiningTime } from 'utils/ts/cafeteria';
import { DiningType } from 'interfaces/Cafeteria';
import { useState } from 'react';
import styles from './Cafeteria.module.scss';
import { useDatePicker } from './hooks/useDatePicker';
import PCCafeteriaPage from './PCCafeteriaPage';

function CafeteriaPage() {
  const isMobile = useMediaQuery();
  const [diningType, setDiningType] = useState<DiningType>(new DiningTime().getType());
  const { currentDate } = useDatePicker();

  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate().toISOString()}>
        {isMobile ? (
          <MobileCafeteriaPage diningType={diningType} setDiningType={setDiningType} />
        ) : (
          <PCCafeteriaPage diningType={diningType} setDiningType={setDiningType} />
        )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
