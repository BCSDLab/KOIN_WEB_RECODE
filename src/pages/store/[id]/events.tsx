import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import StoreEventsPage from 'components/Store/mobile/StoreEventsPage';
import ROUTES from 'static/routes';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';
import { isNotFoundKoinError } from 'utils/ts/isr';

interface Props {
  id: string;
}

export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ id: string }>, cacheControl, serverRequest) => {
    const id = context.params?.id;
    if (!id) return { notFound: true as const };

    // 모바일 전용 화면. 데스크톱은 서버가 확정한 기기 값으로 기존 화면에 보낸다
    if (serverRequest?.device !== 'mobile') {
      return { redirect: { destination: ROUTES.StoreDetail({ id }), permanent: false } };
    }

    // 이벤트 목록을 서버에서 받아 본문까지 렌더한다(클라이언트는 같은 쿼리 키로 캐시를 이어받는다)
    const queryClient = new QueryClient();
    try {
      await queryClient.fetchQuery(storeMobileQueries.events(id));
    } catch (error) {
      if (isNotFoundKoinError(error)) return { notFound: true as const };
      throw error;
    }

    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return { props: { id, dehydratedState: dehydrate(queryClient) } };
  },
);

function StoreEventsRoute({ id }: Props) {
  return (
    <>
      <MobilePageHeader title="이벤트/공지" />
      <StoreEventsPage id={id} />
    </>
  );
}

StoreEventsRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default StoreEventsRoute;
