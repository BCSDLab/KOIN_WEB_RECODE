import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, type DehydratedState, QueryClient } from '@tanstack/react-query';
import { getCart } from 'api/order';
import type { CartResponse, OrderType } from 'api/order/entity';
import { orderQueries } from 'api/order/queries';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderCheckoutPage from 'components/Order/OrderCheckoutPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  orderType: OrderType;
  // 결제 실패로 돌아오면(Toss failUrl) 실패 사유를 안내 모달로 띄운다
  message: string | null;
  dehydratedState?: DehydratedState;
}

// order처럼 DELIVERY가 아니면 포장 주문 화면으로 그린다
const parseOrderType = (value: unknown): OrderType => (value === 'DELIVERY' ? 'DELIVERY' : 'TAKE_OUT');

// 결제(주문서)는 사용자별 화면이라 공개 캐시를 켜지 않는다
export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext, _cacheControl, serverRequest): Promise<{ props: Props }> => {
    const orderType = parseOrderType(context.query.orderType);
    const message = typeof context.query.message === 'string' ? context.query.message : null;

    if (serverRequest?.device !== 'mobile') {
      return { props: { isDesktop: true, orderType, message } };
    }

    // 로그인이면 order가 부르는 장바구니·학생 정보·배달기사님 요청 문구와, 장바구니의 상점으로
    // 배달 가능 여부(배달) 또는 가게 정보(포장)를 서버에서 받아 본문까지 렌더한다.
    // 실패한 조회는 결과를 내리지 않고 클라이언트가 다시 조회한다
    const queryClient = new QueryClient();
    if (serverRequest.isLoggedIn) {
      const [cart] = await Promise.all([
        queryClient
          .fetchQuery({ ...orderQueries.cart(orderType, true), queryFn: () => getCart(orderType, true) })
          .catch((): CartResponse | null => null),
        queryClient.prefetchQuery(orderQueries.studentInfo(true)),
        queryClient.prefetchQuery(orderQueries.riderMessages(true)),
      ]);

      const orderableShopId = cart?.orderable_shop_id ?? 0;
      if (orderableShopId > 0 && orderType === 'DELIVERY') {
        await queryClient.prefetchQuery(orderQueries.shopDeliveryInfo(orderableShopId));
      } else if (orderableShopId > 0) {
        await queryClient.prefetchQuery(storeMobileQueries.orderDetail(String(orderableShopId)));
      }
    }

    return { props: { isDesktop: false, orderType, message, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderCheckoutRoute({ isDesktop, orderType, message }: Props) {
  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
      )}
      <StoreMobileHeader title="주문" />
      {isDesktop ? <DesktopNotice /> : <OrderCheckoutPage orderType={orderType} message={message} />}
    </>
  );
}

OrderCheckoutRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderCheckoutRoute;
