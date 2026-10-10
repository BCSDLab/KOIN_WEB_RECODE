import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { CartResponse, OrderType } from './entity';
import { getCart, getCartSummary } from './index';

// 장바구니는 사용자별 응답이라 getViewerScope로 범위를 키에 넣는다(SSR·클라이언트 키 일치)
export const orderQueryKeys = {
  all: ['order'] as const,
  cart: (orderType: OrderType, scope: 'auth' | 'guest') => [...orderQueryKeys.all, 'cart', scope, orderType] as const,
  cartSummary: (orderableShopId: string, scope: 'auth' | 'guest') =>
    [...orderQueryKeys.all, 'cart-summary', scope, orderableShopId] as const,
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
};
