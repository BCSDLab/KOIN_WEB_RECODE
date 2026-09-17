import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { DiningType } from 'api/dinings/entity';
import ArrowBackNewIcon from 'assets/svg/arrow-back-new.svg';
import StoreCtaIcon from 'assets/svg/Store/store-cta-icon.svg';
import CafeteriaInfoBoundary from 'components/cafeteria/components/CafeteriaInfoBoundary';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import { DINING_TYPES, DINING_TYPE_MAP } from 'static/cafeteria';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import CafeteriaInfoWidget from './components/CafeteriaInfoWidget';
import MobileDiningBlocks from './components/MobileDiningBlocks';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import styles from './MobileCafeteriaPage.module.scss';

export default function MobileCafeteriaPage() {
  const { diningType, setDiningType } = useCafeteriaParams();
  const logger = useLogger();
  const router = useRouter();
  const sessionLogger = useSessionLogger();
  const lastLoggedDiningTypeRef = useRef<DiningType | null>(null);

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

  const handleDiningToStore = () => {
    sessionLogger.actionSessionEvent({
      event_label: 'dining_to_shop',
      value: DINING_TYPE_MAP[diningType],
      session_name: 'dining2shop',
      session_lifetime_minutes: 30,
    });
    router.push('/store');
  };
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
        <button type="button" className={styles['recommend-banner']} onClick={handleDiningToStore}>
          <StoreCtaIcon />
          <div className={styles['recommend-banner__text']}>
            <p className={styles['recommend-banner__text-main']}>오늘의 학식이 별로라면?</p>
            <p className={styles['recommend-banner__text-sub']}>내 주변 음식점 보기</p>
          </div>
          <ArrowBackNewIcon className={styles['recommend-banner__arrow']} />
        </button>
        <MobileDiningBlocks diningType={diningType} />
        <span className={styles.blocks__caution}>식단 정보는 운영 상황 따라 변동될 수 있습니다.</span>
      </div>
      <CafeteriaInfoBoundary>
        <CafeteriaInfoWidget />
      </CafeteriaInfoBoundary>
    </>
  );
}
