import { useEffect, useRef } from 'react';
import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import { DiningType } from 'api/dinings/entity';
import InformationIcon from 'assets/svg/common/information/information-icon-grey.svg';
import CafeteriaInfo from 'components/cafeteria/components/CafeteriaInfo';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import { DINING_TYPES, DINING_TYPE_MAP } from 'static/cafeteria';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import MobileDiningBlocks from './components/MobileDiningBlocks';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import styles from './MobileCafeteriaPage.module.scss';

export default function MobileCafeteriaPage() {
  const { diningType, setDiningType } = useCafeteriaParams();
  const logger = useLogger();
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());
  const lastLoggedDiningTypeRef = useRef<DiningType | null>(null);
  const [isCafeteriaInfoOpen, openCafeteriaInfo, closeCafeteriaInfo] = useBooleanState(false);
  const setButtonContent = useHeaderButtonStore((state) => state.setButtonContent);
  const resetButtonContent = useHeaderButtonStore((state) => state.resetButtonContent);
  useBodyScrollLock(isCafeteriaInfoOpen);

  useEffect(() => {
    setButtonContent(
      <button type="button" aria-label="학생식당 운영 정보 안내" onClick={openCafeteriaInfo}>
        <InformationIcon />
      </button>,
    );
    return resetButtonContent;
  }, [setButtonContent, resetButtonContent, openCafeteriaInfo]);

  const handleDiningTypeChange = (dining: DiningType) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'menu_time', value: DINING_TYPE_MAP[dining] });
    setDiningType(dining);
  };

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const maxHeight = doc.scrollHeight - doc.clientHeight;
      const scrollPercentage = (scrolled / maxHeight) * 100;
      if (scrollPercentage > 70 && lastLoggedDiningTypeRef.current !== diningType) {
        logger.actionEventClick({ team: 'CAMPUS', event_label: 'menu_time', value: DINING_TYPE_MAP[diningType] });
        lastLoggedDiningTypeRef.current = diningType;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [logger, diningType]);

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
        <MobileDiningBlocks diningType={diningType} />
        <span className={styles.blocks__caution}>식단 정보는 운영 상황 따라 변동될 수 있습니다.</span>
      </div>
      <div
        className={cn({
          [styles['cafeteria-info']]: true,
          [styles['cafeteria-info--open']]: isCafeteriaInfoOpen,
        })}
      >
        <CafeteriaInfo cafeteriaInfo={cafeteriaInfo} closeInfo={closeCafeteriaInfo} />
      </div>
    </>
  );
}
