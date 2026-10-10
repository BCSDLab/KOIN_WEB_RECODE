import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderShopReviewsPage from 'components/Order/OrderShopReviewsPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { storeReviewsQueries } from 'components/Store/mobile/StoreReviewsPage/queries';
import { parseReviewSort } from 'components/Store/mobile/StoreReviewsPage/utils/reviewSort';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';
import { isNotFoundKoinError } from 'utils/ts/isr';

type Props = { isDesktop: true; shopId?: undefined } | { isDesktop: false; shopId: string };

export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ id: string }>, cacheControl, serverRequest) => {
    const id = context.params?.id;
    if (!id) return { notFound: true as const };

    if (serverRequest?.device !== 'mobile') {
      cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

      return { props: { isDesktop: true as const } };
    }

    // URL의 id는 주문 가능 상점 번호(orderable_shop_id)다. order는 이 값을 그대로 리뷰 조회에 넘겨
    // 다른 상점 리뷰가 나오는 버그가 있어, 요약의 일반 상점 번호(shop_id)로 리뷰·상점 정보를 조회한다
    const isLoggedIn = serverRequest.isLoggedIn ?? false;
    const sort = parseReviewSort(context.query.sort);
    const queryClient = new QueryClient();
    let shopId: string;
    try {
      const summary = await queryClient.fetchQuery(storeMobileQueries.orderSummary(id));
      shopId = String(summary.shop_id);

      // 상점명·리뷰 통계(최신순)·선택한 정렬의 목록을 서버에서 받아 본문까지 렌더한다(상점 리뷰 화면과 같은 구성).
      // 리뷰 요청은 만료된 access 쿠키로 실패할 수 있어 실패해도 페이지는 그리고 클라이언트가 다시 받는다
      await Promise.all([
        queryClient.fetchQuery(storeMobileQueries.detail(shopId)),
        queryClient.prefetchQuery(storeMobileQueries.reviewList(shopId, 'LATEST', isLoggedIn)),
        sort !== 'LATEST' ? queryClient.prefetchQuery(storeMobileQueries.reviewList(shopId, sort, isLoggedIn)) : null,
        isLoggedIn ? queryClient.prefetchQuery(storeReviewsQueries.myReviews(shopId, sort, isLoggedIn)) : null,
      ]);
    } catch (error) {
      if (isNotFoundKoinError(error)) return { notFound: true as const };
      throw error;
    }

    if (!isLoggedIn) cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return { props: { isDesktop: false as const, shopId, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderShopReviewsRoute({ isDesktop, shopId }: Props) {
  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
      )}
      <StoreMobileHeader title="리뷰" />
      {isDesktop ? <DesktopNotice /> : <OrderShopReviewsPage shopId={shopId} />}
    </>
  );
}

OrderShopReviewsRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderShopReviewsRoute;
