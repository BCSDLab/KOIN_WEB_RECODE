import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, type DehydratedState, QueryClient } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderHomePage from 'components/Order/OrderHomePage';
import { DEFAULT_ORDER_HOME_CONDITIONS, getOrderableShopsParams } from 'components/Order/OrderHomePage/constants';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  dehydratedState?: DehydratedState;
}

// 주문 홈은 공개 화면이라 비로그인이면 다른 상점 목록과 같은 공개 캐시를 켠다(로그인이면 withCacheControl이 무시한다)
export const getServerSideProps = withCacheControl(
  async (_context: GetServerSidePropsContext, cacheControl, serverRequest): Promise<{ props: Props }> => {
    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    if (serverRequest?.device !== 'mobile') {
      return { props: { isDesktop: true } };
    }

    // order가 처음 부르는 두 요청(카테고리·기본 조건 상점 목록)을 서버에서 받아 본문까지 렌더한다.
    // 실패하면 결과를 내리지 않고 클라이언트가 다시 조회한다
    const queryClient = new QueryClient();
    await Promise.all([
      queryClient.prefetchQuery(storeMobileQueries.categories()),
      queryClient.prefetchQuery(orderQueries.orderableShops(getOrderableShopsParams(DEFAULT_ORDER_HOME_CONDITIONS))),
    ]);

    return { props: { isDesktop: false, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderHomeRoute({ isDesktop }: Props) {
  if (isDesktop) {
    return (
      <>
        <StoreMobileHeader title="주문" />
        <DesktopNotice />
      </>
    );
  }

  // viewport는 order 웹뷰(index.html)와 같게 배율을 1로 고정한다(다른 주문 화면과 같은 처리)
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
      </Head>
      <StoreMobileHeader title="주문" background="gray" />
      <OrderHomePage />
    </>
  );
}

OrderHomeRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderHomeRoute;
