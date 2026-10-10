import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderShopInfoPage from 'components/Order/OrderShopInfoPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';
import { isNotFoundKoinError } from 'utils/ts/isr';

interface Props {
  id: string;
  isDesktop: boolean;
}

export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ id: string }>, cacheControl, serverRequest) => {
    const id = context.params?.id;
    if (!id) return { notFound: true as const };

    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    if (serverRequest?.device !== 'mobile') {
      return { props: { id, isDesktop: true } };
    }

    // order가 부르는 상점 상세(order/shop/{id}/detail)만 서버에서 받아 본문까지 렌더한다
    const queryClient = new QueryClient();
    try {
      await queryClient.fetchQuery(storeMobileQueries.orderDetail(id));
    } catch (error) {
      if (isNotFoundKoinError(error)) return { notFound: true as const };
      throw error;
    }

    return { props: { id, isDesktop: false, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderShopInfoRoute({ id, isDesktop }: Props) {
  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
      )}
      <StoreMobileHeader title="상점 정보" />
      {isDesktop ? <DesktopNotice /> : <OrderShopInfoPage id={id} />}
    </>
  );
}

OrderShopInfoRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderShopInfoRoute;
