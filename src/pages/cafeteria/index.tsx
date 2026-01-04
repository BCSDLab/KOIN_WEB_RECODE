import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cafeteria, coopshop } from 'api';
import { DiningType } from 'api/dinings/entity';
import { useDatePicker } from 'components/cafeteria/hooks/useDatePicker';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
import { convertDateToSimpleString, DiningTime } from 'components/cafeteria/utils/time';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './Cafeteria.module.scss';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { date } = context.query;

  const currentDate = date ? new Date(Array.isArray(date) ? date[0] : date) : new Date();

  const convertedDate = convertDateToSimpleString(currentDate);

  await queryClient.prefetchQuery({
    queryKey: ['DININGS_KEY', convertedDate],
    queryFn: async () => {
      const data = await cafeteria.default(convertedDate);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ['COOPSHOP_CAFETERIA_KEY'],
    queryFn: () => coopshop.getCafeteriaInfo(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function Cafeteria() {
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
          <MobileCafeteriaPage diningType={diningType} setDiningType={setDiningType} />
        ) : (
          <PCCafeteriaPage diningType={diningType} setDiningType={setDiningType} />
        )}
      </div>
    </div>
  );
}

export default function CafeteriaPage({ dehydratedState }: { dehydratedState: unknown }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Cafeteria />
    </HydrationBoundary>
  );
}
