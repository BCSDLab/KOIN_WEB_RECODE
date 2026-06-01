import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import { coopshopQueries } from 'api/coopshop/queries';
import { DiningType } from 'api/dinings/entity';
import { useDatePicker } from 'components/cafeteria/hooks/useDatePicker';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
import { convertDateToSimpleString, DiningTime } from 'components/cafeteria/utils/time';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { withCacheControl } from 'utils/ts/withCacheControl';
import styles from './Cafeteria.module.scss';

export const getServerSideProps = withCacheControl(async (context: GetServerSidePropsContext, cacheControl) => {
  const queryClient = new QueryClient();
  const { date } = context.query;

  const currentDate = date ? new Date(Array.isArray(date) ? date[0] : date) : new Date();

  const convertedDate = convertDateToSimpleString(currentDate);

  await queryClient.prefetchQuery(cafeteriaQueries.dinings(convertedDate));

  await queryClient.prefetchQuery(coopshopQueries.cafeteriaInfo());

  cacheControl.enablePublicCache();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
});

function Cafeteria() {
  const isMobile = useMediaQuery();
  const [diningType, setDiningType] = useState<DiningType>(new DiningTime().getType());
  const { currentDate } = useDatePicker();

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

export default function CafeteriaPage({ dehydratedState }: { dehydratedState: DehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Cafeteria />
    </HydrationBoundary>
  );
}
