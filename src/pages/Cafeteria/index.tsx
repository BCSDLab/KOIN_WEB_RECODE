import { useState } from 'react';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import { DiningType } from 'api/dinings/entity';
import { DiningTime } from 'components/cafeteria/utils/time';
import { useDatePicker } from 'components/cafeteria/hooks/useDatePicker';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
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
