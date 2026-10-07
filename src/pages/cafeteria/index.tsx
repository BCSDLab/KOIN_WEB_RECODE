import { useEffect, useRef } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { dehydrate, type DehydratedState, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import { coopshopQueries } from 'api/coopshop/queries';
import type { DiningPlace } from 'api/dinings/entity';
import SoldoutReportIcon from 'assets/svg/cafeteria/soldout-report-icon.svg';
import CafeteriaInfoButton from 'components/cafeteria/components/CafeteriaInfoButton';
import { CafeteriaServerProvider } from 'components/cafeteria/context/CafeteriaServerContext';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import SoldoutReportModal from 'components/cafeteria/MobileCafeteriaPage/components/SoldoutReportModal';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
import { convertDateToSimpleString } from 'components/cafeteria/utils/time';
import showMobileToast from 'components/feedback/Toast/showMobileToast';
import Layout from 'components/layout';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import HeaderIconButton from 'components/ui/PageHeader/HeaderIconButton';
import { SOLDOUT_REPORT_PLACES } from 'static/cafeteria';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { withCacheControl } from 'utils/ssr/withCacheControl';

import styles from './Cafeteria.module.scss';

const SOLDOUT_REPORT_AB_TEST_TITLE = '품절 제보 버튼 A/B 테스트';
const SOLDOUT_REPORT_VARIANT_HEADER = 'soldout_design_A';

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
  const { date } = useCafeteriaParams();
  const logger = useLogger();
  const portalManager = useModalPortal();
  const soldoutReportView = useABTestView(SOLDOUT_REPORT_AB_TEST_TITLE);
  const isSoldoutReportHeaderVariant = soldoutReportView === SOLDOUT_REPORT_VARIANT_HEADER;
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

    const variantLabel = isSoldoutReportHeaderVariant ? 'A안' : 'B안';
    logger.actionEventClick({
      event_name: 'DA1',
      event_label: 'cafeteria__dining__soldout__start',
      value: isSoldoutReportHeaderVariant ? variantLabel : `${variantLabel}_${initialPlace ?? ''}`,
    });
    portalManager.open((portalOption: Portal) => (
      <SoldoutReportModal
        places={SOLDOUT_REPORT_PLACES}
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
            {isSoldoutReportHeaderVariant && (
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
            <MobileCafeteriaPage onReportSoldout={!isSoldoutReportHeaderVariant ? openSoldoutReportModal : undefined} />
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
