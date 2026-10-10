import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, type DehydratedState, QueryClient } from '@tanstack/react-query';
import { getCart } from 'api/order';
import { orderQueries } from 'api/order/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderCartPage from 'components/Order/OrderCartPage';
import OrderCartHeader from 'components/Order/OrderCartPage/components/OrderCartHeader';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  dehydratedState?: DehydratedState;
}

// 장바구니는 사용자별 화면이라 공개 캐시를 켜지 않는다
export const getServerSideProps = withCacheControl(
  async (_context: GetServerSidePropsContext, _cacheControl, serverRequest): Promise<{ props: Props }> => {
    if (serverRequest?.device !== 'mobile') {
      return { props: { isDesktop: true } };
    }

    // 로그인이면 장바구니(주문 유형 기본값 DELIVERY)를 서버에서 받아 본문까지 렌더한다.
    // 만료된 쿠키 등으로 실패하면 결과를 내리지 않고(빈 장바구니로 확정하지 않는다) 클라이언트가 다시 조회한다.
    // 비로그인은 조회하지 않고 빈 장바구니로 그린다(클라이언트가 order처럼 조회해 401이면 그대로 빈 장바구니)
    const queryClient = new QueryClient();
    if (serverRequest.isLoggedIn) {
      await queryClient.prefetchQuery({
        ...orderQueries.cart('DELIVERY', true),
        queryFn: () => getCart('DELIVERY', true),
      });
    }

    return { props: { isDesktop: false, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderCartRoute({ isDesktop }: Props) {
  if (isDesktop) {
    return (
      <>
        <StoreMobileHeader title="장바구니" />
        <DesktopNotice />
      </>
    );
  }

  // viewport는 order 웹뷰(index.html)와 같게 배율을 1로 고정한다(주문 가능 상점 상세와 같은 처리)
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
      </Head>
      <OrderCartHeader />
      <OrderCartPage />
    </>
  );
}

OrderCartRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderCartRoute;
