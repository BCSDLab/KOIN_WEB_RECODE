import { useEffect, useRef } from 'react';
import type { GetServerSidePropsContext } from 'next';

import {
  dehydrate,
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import type { Opens } from 'api/coopshop/entity';
import { coopshopQueries } from 'api/coopshop/queries';
import type { DiningPlace, DiningType } from 'api/dinings/entity';
import SoldoutReportIcon from 'assets/svg/cafeteria/soldout-report-icon.svg';
import CafeteriaInfoButton from 'components/cafeteria/components/CafeteriaInfoButton';
import { CafeteriaServerProvider } from 'components/cafeteria/context/CafeteriaServerContext';
import { useCafeteriaLiveNow } from 'components/cafeteria/hooks/useCafeteriaLiveNow';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import SoldoutReportModal from 'components/cafeteria/MobileCafeteriaPage/components/SoldoutReportModal';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
import { convertDateToSimpleString, kstDayOfWeek, kstTimeOn } from 'components/cafeteria/utils/time';
import showMobileToast from 'components/feedback/Toast/showMobileToast';
import Layout from 'components/layout';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import HeaderIconButton from 'components/ui/PageHeader/HeaderIconButton';
import { DINING_TYPE_MAP } from 'static/cafeteria';
import { useABTestViewWithStatus } from 'utils/hooks/abTest/useABTestView';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { withCacheControl } from 'utils/ssr/withCacheControl';

import styles from './Cafeteria.module.scss';

const SOLDOUT_REPORT_AB_TEST_TITLE = '품절 제보 버튼 A/B 테스트';
const SOLDOUT_REPORT_VARIANT_HEADER = 'soldout_design_A';

// 토요일/일요일은 항상 각자 고유 라벨('토요일'/'일요일')로 내려온다. 시험기간처럼 시간이
// 바뀌는 시기엔 라벨은 그대로고 그 안의 open_time/close_time만 바뀐다.
const COOP_DAY_LABEL: Record<number, Opens['day_of_week']> = {
  0: '일요일',
  1: '평일',
  2: '평일',
  3: '평일',
  4: '평일',
  5: '평일',
  6: '토요일',
};

const HH_MM = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

function isWithinOperatingHours(opens: Opens[], viewedDate: Date, diningType: DiningType, liveNow: Date): boolean {
  const schedule = opens.find(
    (open) =>
      open.day_of_week === COOP_DAY_LABEL[kstDayOfWeek(viewedDate)] && open.type === DINING_TYPE_MAP[diningType],
  );
  // 일요일/토요일 아침처럼 시간 대신 "미운영"·"조식 미운영" 같은 안내 문구가 올 수도 있다 — 유효한 HH:mm일 때만 운영 중으로 본다.
  if (!schedule || !HH_MM.test(schedule.open_time) || !HH_MM.test(schedule.close_time)) return false;

  const [openHour, openMinute] = schedule.open_time.split(':').map(Number);
  const [closeHour, closeMinute] = schedule.close_time.split(':').map(Number);

  return (
    liveNow >= kstTimeOn(viewedDate, openHour, openMinute) && liveNow < kstTimeOn(viewedDate, closeHour, closeMinute)
  );
}

export const getServerSideProps = withCacheControl(async (context: GetServerSidePropsContext, cacheControl) => {
  const queryClient = new QueryClient();
  const { date } = context.query;

  // date 쿼리 유무와 무관한, 요청을 받은 실제 시각. 렌더 경로의 "오늘" 기준값으로 내려보낸다.
  const serverNow = new Date();

  const currentDate = date ? new Date(Array.isArray(date) ? date[0] : date) : serverNow;

  const convertedDate = convertDateToSimpleString(currentDate);

  await queryClient.prefetchQuery(cafeteriaQueries.dinings(convertedDate));

  await queryClient.prefetchQuery(coopshopQueries.cafeteriaInfo());

  cacheControl.enablePublicCache();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      serverNowISO: serverNow.toISOString(),
    },
  };
});

function Cafeteria() {
  const isMobile = useMediaQuery();
  const { date, diningType } = useCafeteriaParams();
  const liveNow = useCafeteriaLiveNow();
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());
  const isViewingLiveMeal = isWithinOperatingHours(cafeteriaInfo.opens, date.current(), diningType, liveNow);
  const logger = useLogger();
  const portalManager = useModalPortal();
  const { variant: soldoutReportView, isPending: isSoldoutReportPending } =
    useABTestViewWithStatus(SOLDOUT_REPORT_AB_TEST_TITLE);
  const isSoldoutReportHeaderVariant = soldoutReportView === SOLDOUT_REPORT_VARIANT_HEADER;
  const isSoldoutReportHeaderReady = !isSoldoutReportPending && isSoldoutReportHeaderVariant;
  const isSoldoutReportCardReady = !isSoldoutReportPending && !isSoldoutReportHeaderVariant;
  const hasLoggedSoldoutExposureRef = useRef(false);

  useScrollToTop();

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
    if (!window.matchMedia('(pointer: coarse)').matches) {
      showMobileToast('info', '모바일에서만 지원하는 기능입니다. 모바일을 이용해주세요.');

      return;
    }

    if (!isViewingLiveMeal) {
      showMobileToast('info', '지금 운영 중인 식단만 제보할 수 있어요.');

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
        initialPlace={initialPlace}
        variantLabel={variantLabel}
        onClose={() => portalOption.close()}
      />
    ));
  };

  return (
    <>
      <MobilePageHeader
        title="식단"
        rightAction={
          <>
            {isSoldoutReportHeaderReady && (
              <HeaderIconButton aria-label="품절 제보하기" onClick={() => openSoldoutReportModal()}>
                <SoldoutReportIcon />
              </HeaderIconButton>
            )}
            <CafeteriaInfoButton />
          </>
        }
      />
      <div className={styles.page}>
        <div className={styles.page__content} key={date.key}>
          {isMobile ? (
            <MobileCafeteriaPage onReportSoldout={isSoldoutReportCardReady ? openSoldoutReportModal : undefined} />
          ) : (
            <PCCafeteriaPage />
          )}
        </div>
      </div>
    </>
  );
}

interface CafeteriaPageProps {
  dehydratedState: DehydratedState;
  serverNowISO: string;
}

export default function CafeteriaPage({ dehydratedState, serverNowISO }: CafeteriaPageProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <CafeteriaServerProvider value={{ serverNow: new Date(serverNowISO) }}>
        <Cafeteria />
      </CafeteriaServerProvider>
    </HydrationBoundary>
  );
}

CafeteriaPage.getLayout = (page: React.ReactNode) => <Layout mobileHeader="page">{page}</Layout>;
