import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { SSRLayout } from 'components/layout';
import OrderViewport from 'components/Order/common/OrderViewport';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderShopPage from 'components/Order/OrderShopPage';
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

    if (serverRequest?.device !== 'mobile') {
      cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

      return { props: { id, isDesktop: true } };
    }

    // 요약·메뉴 그룹·메뉴·상세(전화번호), 요약의 일반 상점 번호로 이벤트, 장바구니를 서버에서 받아 본문까지 렌더한다
    const queryClient = new QueryClient();
    try {
      const [summary] = await Promise.all([
        queryClient.fetchQuery(storeMobileQueries.orderSummary(id)),
        queryClient.fetchQuery(storeMobileQueries.orderMenuGroups(id)),
        queryClient.fetchQuery(storeMobileQueries.orderMenus(id)),
        queryClient.fetchQuery(storeMobileQueries.orderDetail(id)),
      ]);
      await queryClient.fetchQuery(storeMobileQueries.events(String(summary.shop_id)));
    } catch (error) {
      if (isNotFoundKoinError(error)) {
        return { notFound: true as const };
      }
      throw error;
    }

    // 로그인이면 장바구니(주문 유형 기본값 DELIVERY)까지 받아 하단 장바구니 막대를 서버에서 그린다.
    // 막대 조회 실패는 본문 렌더를 막지 않는다(클라이언트가 다시 조회). 비로그인은 공유 캐시를 쓰고 장바구니는 클라이언트가 조회한다
    if (serverRequest.isLoggedIn) {
      try {
        const cart = await queryClient.fetchQuery(orderQueries.cart('DELIVERY', true));
        if (cart.items.length > 0 && cart.orderable_shop_id === Number(id)) {
          await queryClient.fetchQuery(orderQueries.cartSummary(id, true));
        }
      } catch {
        // 장바구니 막대만 빠진다
      }
    } else {
      cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);
    }

    return { props: { id, isDesktop: false, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderShopRoute({ id, isDesktop }: Props) {
  // 모바일은 이미지 위에 겹치는 상세 전용 헤더를 본문에서 그린다
  if (!isDesktop) {
    return (
      <>
        <OrderViewport />
        <OrderShopPage id={id} />
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

OrderShopRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderShopRoute;
