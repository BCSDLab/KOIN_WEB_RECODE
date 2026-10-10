import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderMenuDetailPage from 'components/Order/OrderMenuDetailPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';
import { isNotFoundKoinError } from 'utils/ts/isr';

interface Props {
  id: string;
  menuId: string;
  isDesktop: boolean;
}

export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ id: string; menuId: string }>, cacheControl, serverRequest) => {
    const id = context.params?.id;
    const menuId = context.params?.menuId;
    if (!id || !menuId) return { notFound: true as const };

    if (serverRequest?.device !== 'mobile') {
      cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

      return { props: { id, menuId, isDesktop: true } };
    }

    // order가 부르는 메뉴 상세만 서버에서 받아 본문까지 렌더한다(order는 이 화면에서 장바구니를 조회하지 않는다).
    // 편집 모드(?editCartItemId)의 장바구니 항목 옵션은 클라이언트가 조회한다
    const queryClient = new QueryClient();
    try {
      await queryClient.fetchQuery(orderQueries.menuDetail(id, menuId));
    } catch (error) {
      if (isNotFoundKoinError(error)) {
        return { notFound: true as const };
      }
      throw error;
    }

    if (!serverRequest.isLoggedIn) {
      cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);
    }

    return { props: { id, menuId, isDesktop: false, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderMenuDetailRoute({ id, menuId, isDesktop }: Props) {
  // 모바일은 이미지 위에 겹치는 상세 전용 헤더를 본문에서 그린다.
  // viewport는 order 웹뷰(index.html)와 같게 배율을 1로 고정한다(주문 가능 상점 상세와 같은 처리)
  if (!isDesktop) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
        <OrderMenuDetailPage shopId={id} menuId={menuId} />
      </>
    );
  }

  return (
    <>
      <StoreMobileHeader title="주변상점" />
      <DesktopNotice />
    </>
  );
}

OrderMenuDetailRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderMenuDetailRoute;
