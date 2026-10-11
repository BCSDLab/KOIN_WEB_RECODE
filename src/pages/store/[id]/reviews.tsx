import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import StoreReviewsPage from 'components/Store/mobile/StoreReviewsPage';
import { storeReviewsQueries } from 'components/Store/mobile/StoreReviewsPage/queries';
import { parseReviewSort } from 'components/Store/mobile/StoreReviewsPage/utils/reviewSort';
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

    // 상점명·리뷰 통계(최신순)·선택한 정렬의 목록을 서버에서 받아 본문까지 렌더한다.
    // 로그인이면 내 리뷰도 받는다. 만료 등으로 실패해도 페이지는 그리고 클라이언트가 다시 받는다(prefetchQuery)
    const isLoggedIn = serverRequest?.isLoggedIn ?? false;
    const sort = parseReviewSort(context.query.sort);
    const queryClient = new QueryClient();
    try {
      await Promise.all([
        queryClient.fetchQuery(storeMobileQueries.detail(id)),
        // 리뷰 요청에는 요청 쿠키가 실린다. 만료·무효 access 쿠키면 401인데 서버는 refresh를 못 하므로 실패해도 넘어간다
        queryClient.prefetchQuery(storeMobileQueries.reviewList(id, 'LATEST', isLoggedIn)),
        sort !== 'LATEST' ? queryClient.prefetchQuery(storeMobileQueries.reviewList(id, sort, isLoggedIn)) : null,
        isLoggedIn ? queryClient.prefetchQuery(storeReviewsQueries.myReviews(id, sort, isLoggedIn)) : null,
      ]);
    } catch (error) {
      if (isNotFoundKoinError(error)) return { notFound: true as const };
      throw error;
    }

    if (!isLoggedIn) cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return { props: { id, dehydratedState: dehydrate(queryClient) } };
  },
);

function StoreReviewsRoute({ id }: Props) {
  return (
    <>
      <StoreMobileHeader title="리뷰" />
      <StoreReviewsPage id={id} />
    </>
  );
}

StoreReviewsRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default StoreReviewsRoute;
