import { useEffect, useState } from 'react';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import { DiningType } from 'api/dinings/entity';
import { DiningTime } from 'components/cafeteria/utils/time';
import { useDatePicker } from 'components/cafeteria/hooks/useDatePicker';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import styles from './Cafeteria.module.scss';

function CafeteriaPage() {
  const isMobile = useMediaQuery();
  const [diningType, setDiningType] = useState<DiningType>(new DiningTime().getType());
  const { currentDate } = useDatePicker();
  const sessionLogger = useSessionLogger();
  const token = useTokenState();
  const designVariant = useABTestView('dining_store', token);

  useEffect(() => {
    sessionLogger.actionSessionEvent({
      event_label: 'dining2shop_1',
      value: designVariant === 'control' ? 'design_A' : 'design_B',
      event_category: 'a/b test 로깅(메인화면 식단 진입)',
      session_name: 'dining2shop',
      session_lifetime_minutes: 30,
    });
  });

  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate().toISOString()}>
        {isMobile ? (
          <MobileCafeteriaPage diningType={diningType} setDiningType={setDiningType} designVariant={designVariant} />
        ) : (
          <PCCafeteriaPage diningType={diningType} setDiningType={setDiningType} designVariant={designVariant} />
        )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
