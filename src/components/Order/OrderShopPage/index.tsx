import { useEffect, useMemo, useRef } from 'react';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { isUnauthorizedError, orderQueries } from 'api/order/queries';
import type { ShopInfoResponse } from 'api/storeMobile/entity';
import { storeMobileQueries } from 'api/storeMobile/queries';
import DetailHeader from 'components/Store/mobile/StoreDetailPage/components/DetailHeader';
import ImageCarousel from 'components/Store/mobile/StoreDetailPage/components/ImageCarousel';
import ShopMenuGroups from 'components/Store/mobile/StoreDetailPage/components/ShopMenuGroups';
import type { MenuGroupItems } from 'components/Store/mobile/StoreDetailPage/components/ShopMenus';
import useMenuGroupScroll from 'components/Store/mobile/StoreDetailPage/hooks/useMenuGroupScroll';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useOrderStore } from 'utils/zustand/order';

import BottomCartModal from './components/BottomCartModal';
import OrderShopMenus from './components/OrderShopMenus';
import OrderShopSummary from './components/OrderShopSummary';
import styles from './OrderShopPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/OrderableShopView 이전 (주문 가능 상점 상세).
// 구조는 주문 불가 상점 상세(A4)와 같아 헤더·캐러셀·메뉴 그룹을 그대로 쓰고, 요약·메뉴 목록은 주문 가능 분기로 그린다.
// 오라클의 이 화면은 스크롤 로깅·진입 시각 기록을 하지 않는다.
// 장바구니는 order처럼 비로그인이어도 조회하고(401이면 빈 장바구니) 이 상점 메뉴가 담겨 있을 때만 하단 막대를 띄운다.
// 로그인 상태는 서버가 장바구니를 미리 받아 막대까지 렌더한다
interface OrderShopPageProps {
  id: string;
}

function toMenuGroups(data: ShopInfoResponse[]): MenuGroupItems[] {
  return data.map((group) => ({
    menuGroupId: group.menu_group_id,
    menuGroupName: group.menu_group_name,
    menus: group.menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      thumbnailImage: menu.thumbnail_image,
      isSoldOut: menu.is_sold_out,
      prices: menu.prices.map((price) => ({ id: price.id, name: price.name, price: price.price })),
    })),
  }));
}

export default function OrderShopPage({ id }: OrderShopPageProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { selectedMenu, menuGroupRefs, isAutoScrolling, handleScrollTo, handleChangeMenu } = useMenuGroupScroll();

  const { data: shopInfoSummary } = useSuspenseQuery(storeMobileQueries.orderSummary(id));
  const { data: shopMenuGroups } = useSuspenseQuery(storeMobileQueries.orderMenuGroups(id));
  const { data: shopMenusResponse } = useSuspenseQuery(storeMobileQueries.orderMenus(id));

  const isLoggedIn = useIsLoggedIn();
  const { orderType, setOrderType } = useOrderStore();
  const { data: cartInfo, error: cartError } = useQuery(orderQueries.cart(orderType, isLoggedIn));

  // order useCart: 401 외의 오류면 다른 주문 유형으로 다시 조회한다. 둘 다 실패해 번갈아 조회하지 않도록 한 번만 바꾼다
  const hasSwitchedOrderType = useRef(false);
  useEffect(() => {
    if (!cartError || isUnauthorizedError(cartError) || hasSwitchedOrderType.current) return;
    hasSwitchedOrderType.current = true;
    setOrderType(orderType === 'DELIVERY' ? 'TAKE_OUT' : 'DELIVERY');
  }, [cartError, orderType, setOrderType]);

  const cartItems = cartInfo?.items ?? [];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasThisShopInCart = cartItems.length > 0 && cartInfo?.orderable_shop_id === Number(id);

  const shopMenus = useMemo(() => toMenuGroups(shopMenusResponse), [shopMenusResponse]);
  const menuGroups = shopMenuGroups.count > 0 ? shopMenuGroups.menu_groups : [];

  return (
    <div className={styles.page}>
      <DetailHeader name={shopInfoSummary.name} targetRef={targetRef} />
      <ImageCarousel images={shopInfoSummary.images} targetRef={targetRef} shopName={shopInfoSummary.name} />
      <OrderShopSummary id={id} shopInfoSummary={shopInfoSummary} />
      <ShopMenuGroups
        shopName={shopInfoSummary.name}
        selectedMenu={selectedMenu}
        onSelect={handleScrollTo}
        menuGroups={menuGroups}
      />
      <OrderShopMenus
        id={id}
        menuGroupRefs={menuGroupRefs}
        handleChangeMenu={handleChangeMenu}
        isAutoScrolling={isAutoScrolling}
        shopMenus={shopMenus}
      />
      {hasThisShopInCart && <BottomCartModal id={id} cartItemCount={totalQuantity} isLoggedIn={isLoggedIn} />}
    </div>
  );
}
