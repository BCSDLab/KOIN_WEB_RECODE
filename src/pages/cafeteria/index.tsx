import { GetServerSidePropsContext } from 'next';
import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import { coopshopQueries } from 'api/coopshop/queries';
import { CafeteriaServerProvider } from 'components/cafeteria/context/CafeteriaServerContext';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import MobileCafeteriaPage from 'components/cafeteria/MobileCafeteriaPage';
import PCCafeteriaPage from 'components/cafeteria/PCCafeteriaPage';
import { convertDateToSimpleString } from 'components/cafeteria/utils/time';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { withCacheControl } from 'utils/ts/withCacheControl';
import styles from './Cafeteria.module.scss';

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

  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={date.key}>
        {isMobile ? <MobileCafeteriaPage /> : <PCCafeteriaPage />}
      </div>
    </div>
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
