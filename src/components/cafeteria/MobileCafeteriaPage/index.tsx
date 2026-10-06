import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import type { DiningPlace, DiningType } from 'api/dinings/entity';
import ArrowBackNewIcon from 'assets/svg/arrow-back-new.svg';
import SoldoutReportIcon from 'assets/svg/cafeteria/soldout-report-icon.svg';
import InformationIcon from 'assets/svg/common/information/information-icon-grey.svg';
import type { DiningType } from 'api/dinings/entity';
import ArrowBackNewIcon from 'assets/svg/arrow-back-new.svg';
import StoreCtaIcon from 'assets/svg/Store/store-cta-icon.svg';
import CafeteriaInfoBoundary from 'components/cafeteria/components/CafeteriaInfoBoundary';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import useSoldoutPlaces from 'components/cafeteria/hooks/useSoldoutPlaces';
import SoldoutReportModal from 'components/cafeteria/MobileCafeteriaPage/components/SoldoutReportModal';
import showMobileToast from 'components/feedback/Toast/showMobileToast';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import { DINING_TYPES, DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import ROUTES from 'static/routes';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';

import CafeteriaInfoWidget from './components/CafeteriaInfoWidget';
import MobileDiningBlocks from './components/MobileDiningBlocks';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import styles from './MobileCafeteriaPage.module.scss';

const SOLDOUT_REPORT_AB_TEST_TITLE = '품절 제보 버튼 A/B 테스트';
const SOLDOUT_REPORT_VARIANT_HEADER = 'soldout_design_A';
const SOLDOUT_REPORT_PLACES: DiningPlace[] = PLACE_ORDER.filter((place) => place !== '2캠퍼스');

export default function MobileCafeteriaPage() {
  const { date, diningType, setDiningType } = useCafeteriaParams();
  const logger = useLogger();
  const router = useRouter();
  const sessionLogger = useSessionLogger();
  const lastLoggedDiningTypeRef = useRef<DiningType | null>(null);
  const [isCafeteriaInfoOpen, openCafeteriaInfo, closeCafeteriaInfo] = useBooleanState(false);
  const setButtonContent = useHeaderButtonStore((state) => state.setButtonContent);
  const resetButtonContent = useHeaderButtonStore((state) => state.resetButtonContent);
  const portalManager = useModalPortal();
  const soldoutReportView = useABTestView(SOLDOUT_REPORT_AB_TEST_TITLE);
  const isSoldoutReportHeaderVariant = soldoutReportView === SOLDOUT_REPORT_VARIANT_HEADER;
  const soldoutPlaces = useSoldoutPlaces(date.current(), diningType);
  const hasLoggedSoldoutExposureRef = useRef(false);
  useBodyScrollLock(isCafeteriaInfoOpen);

  useEffect(() => {
    if (soldoutReportView === 'default' || hasLoggedSoldoutExposureRef.current) return;
    hasLoggedSoldoutExposureRef.current = true;
    logger.actionEventClick({
      event_name: 'DA1',
      event_category: 'exposure',
      event_label: 'cafeteria__dining__abtest__exposure',
      value: isSoldoutReportHeaderVariant ? 'A안' : 'B안',
    });
  }, [soldoutReportView, isSoldoutReportHeaderVariant, logger]);

  const openSoldoutReportModal = (initialPlace?: DiningPlace) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches) {
      showMobileToast('info', '모바일에서만 지원하는 기능입니다. 모바일을 이용해주세요.');

      return;
    }

    const variantLabel = isSoldoutReportHeaderVariant ? 'A안' : 'B안';
    logger.actionEventClick({
      event_name: 'DA1',
      event_label: 'cafeteria__dining__soldout__start',
      value: isSoldoutReportHeaderVariant ? variantLabel : `${variantLabel}_${initialPlace ?? ''}`,
    });
    portalManager.open((portalOption: Portal) => (
      <SoldoutReportModal
        places={SOLDOUT_REPORT_PLACES}
        soldoutPlaces={soldoutPlaces}
        initialPlace={initialPlace}
        variantLabel={variantLabel}
        onClose={() => portalOption.close()}
      />
    ));
  };

  useEffect(() => {
    setButtonContent(
      <div className={styles['header-button__container']}>
        {isSoldoutReportHeaderVariant && (
          <button
            type="button"
            aria-label="품절 제보하기"
            className={styles['header-button__icon']}
            onClick={() => openSoldoutReportModal()}
          >
            <SoldoutReportIcon />
          </button>
        )}
        <button
          type="button"
          aria-label="학생식당 운영 정보 안내"
          className={styles['header-button__icon']}
          onClick={openCafeteriaInfo}
        >
          <InformationIcon />
        </button>
      </div>,
    );

    return resetButtonContent;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- openSoldoutReportModal은 logger/portalManager로만 재생성되는 안정적인 콜백이라 deps에서 제외
  }, [setButtonContent, resetButtonContent, openCafeteriaInfo, isSoldoutReportHeaderVariant]);

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
    router.push(ROUTES.Store());
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
        <MobileDiningBlocks
          diningType={diningType}
          onReportSoldout={!isSoldoutReportHeaderVariant ? openSoldoutReportModal : undefined}
          reportablePlaces={SOLDOUT_REPORT_PLACES}
        />
        <span className={styles.blocks__caution}>식단 정보는 운영 상황 따라 변동될 수 있습니다.</span>
      </div>
      <CafeteriaInfoBoundary>
        <CafeteriaInfoWidget />
      </CafeteriaInfoBoundary>
    </>
  );
}
