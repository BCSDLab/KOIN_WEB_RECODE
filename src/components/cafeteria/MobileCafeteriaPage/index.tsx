import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { Suspense, useEffect, useState } from 'react';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import CafeteriaInfo from 'components/cafeteria/components/CafeteriaInfo';
import useCoopshopCafeteria from 'components/cafeteria/hooks/useCoopshopCafeteria';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import InformationIcon from 'assets/svg/common/information/information-icon-white.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { DiningType } from 'api/dinings/entity';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import { DINING_TYPES, DINING_TYPE_MAP } from 'static/cafeteria';
import { useRouter } from 'next/router';
import useTokenState from 'utils/hooks/state/useTokenState';
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
  const router = useRouter();
  const sessionLogger = useSessionLogger();
  const [hasLoggedScroll, setHasLoggedScroll] = useState(false);
  const { cafeteriaInfo } = useCoopshopCafeteria();
  const [isCafeteriaInfoOpen, openCafeteriaInfo, closeCafeteriaInfo] = useBooleanState(false);
  const setButtonContent = useHeaderButtonStore((state) => state.setButtonContent);
  const token = useTokenState();
  const designVariant = useABTestView('dining_store', token);
  useBodyScrollLock(isCafeteriaInfoOpen);

  useEffect(() => {
    setButtonContent((
      <button
        type="button"
        aria-label="학생식당 운영 정보 안내"
        onClick={openCafeteriaInfo}
      >
        <InformationIcon />
      </button>
    ));
  }, [setButtonContent, openCafeteriaInfo]);

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

      if (scrollPercentage > 70 && !hasLoggedScroll) {
        logger.actionEventClick({ team: 'CAMPUS', event_label: 'menu_time', value: DINING_TYPE_MAP[diningType] });
        setHasLoggedScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasLoggedScroll, logger, diningType]);

  const handleDiningToStore = () => {
    sessionLogger.actionSessionEvent({
      event_label: 'dining_to_shop',
      value: DINING_TYPE_MAP[diningType],
      event_category: 'click',
      session_name: 'dining2shop',
      session_lifetime: 30,
    });
    router.push('/store');
  };

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
        {designVariant === 'variant' && (
          <div className={styles['recommend-banner']}>
            오늘 학식 메뉴가 별로라면?
            <button
              type="button"
              className={styles['recommend-banner__button']}
              onClick={handleDiningToStore}
            >
              주변상점 보기
            </button>
          </div>
        )}
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
