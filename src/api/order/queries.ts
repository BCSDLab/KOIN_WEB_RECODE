import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { CampusAddressCategory, CartResponse, OrderType } from './entity';
import {
  getCampusDeliveryAddresses,
  getCart,
  getCartItemOptions,
  getCartSummary,
  getOrderShopMenuDetail,
  searchAddress,
} from './index';

// 장바구니는 사용자별 응답이라 getViewerScope로 범위를 키에 넣는다(SSR·클라이언트 키 일치)
export const orderQueryKeys = {
  all: ['order'] as const,
  cart: (orderType: OrderType, scope: 'auth' | 'guest') => [...orderQueryKeys.all, 'cart', scope, orderType] as const,
  cartSummary: (orderableShopId: string, scope: 'auth' | 'guest') =>
    [...orderQueryKeys.all, 'cart-summary', scope, orderableShopId] as const,
  menuDetail: (shopId: string, menuId: string) => [...orderQueryKeys.all, 'menu-detail', shopId, menuId] as const,
  cartItemOptions: (cartMenuItemId: string) => [...orderQueryKeys.all, 'cart-item-options', cartMenuItemId] as const,
  // 배달지 목록·주소 검색은 로그인과 무관한 공개 데이터라 범위를 키에 넣지 않는다
  campusDeliveryAddresses: (filter: CampusAddressCategory) =>
    [...orderQueryKeys.all, 'campus-delivery-addresses', filter] as const,
  addressSearch: (keyword: string) => [...orderQueryKeys.all, 'address-search', keyword] as const,
};

// order useCart의 dummyCart: 비로그인(401)이면 빈 장바구니로 그린다
export const EMPTY_CART: CartResponse = {
  shop_name: '',
  shop_thumbnail_image_url: '',
  orderable_shop_id: 0,
  is_delivery_available: false,
  is_takeout_available: false,
  shop_minimum_order_amount: 0,
  items: [],
  total_amount: 0,
  items_amount: 0,
  delivery_fee: 0,
  final_payment_amount: 0,
};

function getErrorStatus(error: unknown): number | undefined {
  if (isKoinError(error)) return error.status;
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const { response } = error as { response?: { status?: unknown } };
    if (typeof response?.status === 'number') return response.status;
  }

  return undefined;
}

export function isUnauthorizedError(error: unknown) {
  return getErrorStatus(error) === 401;
}

export const orderQueries = {
  cart: (orderType: OrderType, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.cart(orderType, getViewerScope(isLoggedIn)),
      queryFn: async () => {
        try {
          return await getCart(orderType, isLoggedIn);
        } catch (error) {
          if (isUnauthorizedError(error)) return EMPTY_CART;
          throw error;
        }
      },
    }),
  cartSummary: (orderableShopId: string, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.cartSummary(orderableShopId, getViewerScope(isLoggedIn)),
      queryFn: () => getCartSummary(orderableShopId),
    }),
  // 메뉴 상세는 공개 데이터라 범위를 키에 넣지 않는다
  menuDetail: (shopId: string, menuId: string) =>
    queryOptions({
      queryKey: orderQueryKeys.menuDetail(shopId, menuId),
      queryFn: () => getOrderShopMenuDetail(shopId, menuId),
    }),
  cartItemOptions: (cartMenuItemId: string, enabled: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.cartItemOptions(cartMenuItemId),
      queryFn: () => getCartItemOptions(cartMenuItemId),
      enabled,
    }),
  // KOIN_ORDER_WEBVIEW useCampusDeliveryAddress 이전(교내 배달지 분류별 목록)
  campusDeliveryAddresses: (filter: CampusAddressCategory) =>
    queryOptions({
      queryKey: orderQueryKeys.campusDeliveryAddresses(filter),
      queryFn: () => getCampusDeliveryAddresses(filter),
    }),
  // KOIN_ORDER_WEBVIEW useRoadNameAddress 이전. order처럼 자동 조회하지 않고 Enter에서 refetch로만 조회한다
  addressSearch: (keyword: string) =>
    queryOptions({
      queryKey: orderQueryKeys.addressSearch(keyword),
      queryFn: () => searchAddress(keyword, '1', '10'),
      enabled: false,
    }),
};
