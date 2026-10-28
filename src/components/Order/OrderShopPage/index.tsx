import { useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import type { ShopInfoResponse } from 'api/storeMobile/entity';
import { storeMobileQueries } from 'api/storeMobile/queries';
import useCartOrderTypeFallback from 'components/Order/common/hooks/useCartOrderTypeFallback';
import DetailHeader from 'components/Store/mobile/StoreDetailPage/components/DetailHeader';
import ImageCarousel from 'components/Store/mobile/StoreDetailPage/components/ImageCarousel';
import ShopMenuGroups from 'components/Store/mobile/StoreDetailPage/components/ShopMenuGroups';
import ShopMenus, { type MenuGroupItems } from 'components/Store/mobile/StoreDetailPage/components/ShopMenus';
import ShopSummary from 'components/Store/mobile/StoreDetailPage/components/ShopSummary';
import useMenuGroupScroll from 'components/Store/mobile/StoreDetailPage/hooks/useMenuGroupScroll';
import ROUTES from 'static/routes';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { formatNumber, formatPrice } from 'utils/ts/formatPrice';
import { useOrderStore } from 'utils/zustand/order';

import BottomCartModal from './components/BottomCartModal';
import styles from './OrderShopPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/OrderableShopView 이전 (주문 가능 상점 상세).
// 구조는 주문 불가 상점 상세와 같아 헤더·캐러셀·요약·메뉴 그룹·메뉴 목록을 그대로 쓰고 주문 가능 분기 값만 넘긴다.
// KOIN_ORDER_WEBVIEW의 이 화면은 스크롤 로깅·진입 시각 기록을 하지 않는다.
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
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { selectedMenu, menuGroupRefs, isAutoScrolling, handleScrollTo, handleChangeMenu } = useMenuGroupScroll();

  const { data: shopInfoSummary } = useSuspenseQuery(storeMobileQueries.orderSummary(id));
  const { data: shopMenuGroups } = useSuspenseQuery(storeMobileQueries.orderMenuGroups(id));
  const { data: shopMenusResponse } = useSuspenseQuery(storeMobileQueries.orderMenus(id));
  // 주문 가능 상점 요약에는 전화번호가 없어 상점 상세(가게 정보와 같은 응답)에서 받는다
  const { data: shopDetail } = useSuspenseQuery(storeMobileQueries.orderDetail(id));

  const isLoggedIn = useIsLoggedIn();
  const orderType = useOrderStore((state) => state.orderType);
  const { data: cartInfo, error: cartError } = useQuery(orderQueries.cart(orderType, isLoggedIn));

  useCartOrderTypeFallback(cartError, orderType);

  const cartItems = cartInfo?.items ?? [];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasThisShopInCart = cartItems.length > 0 && cartInfo?.orderable_shop_id === Number(id);

  const shopMenus = useMemo(() => toMenuGroups(shopMenusResponse), [shopMenusResponse]);
  const menuGroups = shopMenuGroups.count > 0 ? shopMenuGroups.menu_groups : [];

  return (
    <div className={styles.page}>
      <DetailHeader name={shopInfoSummary.name} targetRef={targetRef} fallbackHref={ROUTES.OrderHome()} />
      <ImageCarousel images={shopInfoSummary.images} targetRef={targetRef} shopName={shopInfoSummary.name} />
      <ShopSummary
        shopInfoSummary={shopInfoSummary}
        reviewsHref={ROUTES.OrderShopReviews({ id })}
        infoHref={ROUTES.OrderShopInfo({ id })}
        infoLabel="가게정보·원산지"
        badges={[
          shopInfoSummary.is_delivery_available && '배달 가능',
          shopInfoSummary.is_takeout_available && '포장 가능',
        ].filter((badge): badge is string => !!badge)}
        deliveryCard={{
          href: `${ROUTES.OrderShopInfo({ id })}#배달금액`,
          minimumOrder: formatPrice(shopInfoSummary.minimum_order_amount ?? 0),
          deliveryFee: `${formatNumber(shopInfoSummary.minimum_delivery_tip ?? 0)} - ${formatPrice(shopInfoSummary.maximum_delivery_tip ?? 0)}`,
        }}
        phone={shopDetail.phone}
      />
      <ShopMenuGroups
        shopName={shopInfoSummary.name}
        selectedMenu={selectedMenu}
        onSelect={handleScrollTo}
        menuGroups={menuGroups}
      />
      <ShopMenus
        menuGroupRefs={menuGroupRefs}
        handleChangeMenu={handleChangeMenu}
        isAutoScrolling={isAutoScrolling}
        shopMenus={shopMenus}
        onMenuClick={(menu) => router.push(ROUTES.OrderShopMenu({ id, menuId: String(menu.id) }))}
      />
      {hasThisShopInCart && <BottomCartModal id={id} cartItemCount={totalQuantity} isLoggedIn={isLoggedIn} />}
    </div>
  );
}
