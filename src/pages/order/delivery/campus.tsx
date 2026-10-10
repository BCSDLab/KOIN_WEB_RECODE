import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, type DehydratedState, QueryClient } from '@tanstack/react-query';
import { CAMPUS_ADDRESS_CATEGORIES } from 'api/order/entity';
import { orderQueries } from 'api/order/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderDeliveryCampusPage from 'components/Order/OrderDelivery/OrderDeliveryCampusPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  dehydratedState?: DehydratedState;
}

// 배달지 선택은 사용자별 화면이라 공개 캐시를 켜지 않는다
export const getServerSideProps = withCacheControl(
  async (_context: GetServerSidePropsContext, _cacheControl, serverRequest): Promise<{ props: Props }> => {
    if (serverRequest?.device !== 'mobile') {
      return { props: { isDesktop: true } };
    }

    // order가 부르는 교내 배달지 분류 3개를 서버에서 받아 본문까지 렌더한다.
    // 실패하면 결과를 내리지 않고 클라이언트가 다시 조회한다
    const queryClient = new QueryClient();
    await Promise.all(
      CAMPUS_ADDRESS_CATEGORIES.map((filter) => queryClient.prefetchQuery(orderQueries.campusDeliveryAddresses(filter))),
    );

    return { props: { isDesktop: false, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderDeliveryCampusRoute({ isDesktop }: Props) {
  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
      )}
      <StoreMobileHeader title="주소 상세" />
      {isDesktop ? <DesktopNotice /> : <OrderDeliveryCampusPage />}
    </>
  );
}

OrderDeliveryCampusRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderDeliveryCampusRoute;
