import { cn } from '@bcsdlab/utils';
import { Suspense, useEffect, useState } from 'react';
import { DINING_TYPES, DINING_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { DiningType } from 'interfaces/Cafeteria';
import useLogger from 'utils/hooks/useLogger';
import MobileDiningBlocks from './components/MobileDiningBlocks';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import styles from './MobileCafeteriaPage.module.scss';

interface MobileCafeteriaPageProps {
  diningType: DiningType;
  setDiningType: (diningType: DiningType) => void;
}

export default function MobileCafeteriaPage({
  diningType, setDiningType,
}: MobileCafeteriaPageProps) {
  const logger = useLogger();
  const [hasLoggedScroll, setHasLoggedScroll] = useState(false);

  const handleDiningTypeChange = (dining: DiningType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'menu_time', value: DINING_TYPE_MAP[dining] });
    setDiningType(dining);
  };

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const maxHeight = doc.scrollHeight - doc.clientHeight;
      const scrollPercentage = (scrolled / maxHeight) * 100;

      if (scrollPercentage > 70 && !hasLoggedScroll) {
        logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'menu_time', value: DINING_TYPE_MAP[diningType] });
        setHasLoggedScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasLoggedScroll, logger, diningType]);

  useEffect(() => {
    setHasLoggedScroll(false);
  }, [diningType]);

  useScrollToTop();

  return (
    <>
      <WeeklyDatePicker />
      <div className={styles['type-select']}>
        {DINING_TYPES.map((dining) => (
          <button
            className={cn({
              [styles['type-select__button']]: true,
              [styles['type-select__button--selected']]: dining === diningType,
            })}
            key={dining}
            type="button"
            onClick={() => handleDiningTypeChange(dining)}
          >
            {DINING_TYPE_MAP[dining]}
          </button>
        ))}
      </div>
      <div className={styles.blocks}>
        <Suspense fallback={<div />}>
          <MobileDiningBlocks diningType={diningType} />
        </Suspense>
        <span className={styles.blocks__caution}>식단 정보는 운영 상황 따라 변동될 수 있습니다.</span>
      </div>
    </>
  );
}
