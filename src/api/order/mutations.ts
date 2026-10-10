import { mutationOptions, type QueryClient } from '@tanstack/react-query';

import type { AddCartRequest, OrderType, UpdateCartItemRequest } from './entity';
import {
  addCart,
  deleteCartItem,
  resetCart,
  updateCartItemOptions,
  updateCartItemQuantity,
  validateCart,
} from './index';
import { orderQueryKeys } from './queries';

// KOIN_ORDER_WEBVIEW useAddCart·useResetCart·useUpdateCartItemOptions 이전.
// order처럼 담기·초기화가 성공하면 장바구니 조회(주문 유형·범위 전부)를 무효화한다
const invalidateCartQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: [...orderQueryKeys.all, 'cart'] });

export const orderMutations = {
  addCart: (queryClient: QueryClient, isLoggedIn: boolean) =>
    mutationOptions({
      mutationFn: (data: AddCartRequest) => addCart(data, isLoggedIn),
      onSuccess: () => invalidateCartQueries(queryClient),
    }),

  resetCart: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: () => resetCart(),
      onSuccess: () => invalidateCartQueries(queryClient),
    }),

  updateCartItemOptions: (cartMenuItemId: string) =>
    mutationOptions({
      mutationFn: (data: UpdateCartItemRequest) => updateCartItemOptions(cartMenuItemId, data),
    }),

  // KOIN_ORDER_WEBVIEW useUpdateCartItemQuantity·useDeleteCartItem·useValidateCart 이전(장바구니 화면)
  updateCartItemQuantity: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ cartMenuItemId, quantity }: { cartMenuItemId: number; quantity: number }) =>
        updateCartItemQuantity(cartMenuItemId, quantity),
      onSuccess: () => invalidateCartQueries(queryClient),
    }),

  deleteCartItem: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (cartMenuItemId: number) => deleteCartItem(cartMenuItemId),
      onSuccess: () => invalidateCartQueries(queryClient),
    }),

  validateCart: () =>
    mutationOptions({
      mutationFn: (orderType: OrderType) => validateCart(orderType),
    }),
};
