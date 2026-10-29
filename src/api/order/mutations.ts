import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import { smsSend, smsVerify } from 'api/auth';

import type {
  AddCartRequest,
  CancelPaymentRequest,
  DeliveryOrderRequest,
  OffCampusDeliveryAddressRequest,
  OffCampusDeliveryValidateRequest,
  OrderType,
  TakeoutOrderRequest,
  UpdateCartItemRequest,
} from './entity';
import {
  addCart,
  cancelPayment,
  createDeliveryOrder,
  createTakeoutOrder,
  deleteCartItem,
  registerOffCampusDeliveryAddress,
  resetCart,
  updateCartItemOptions,
  updateCartItemQuantity,
  validateCart,
  validateOffCampusDeliveryAddress,
} from './index';
import { orderQueryKeys } from './queries';

// KOIN_ORDER_WEBVIEW useAddCart·useResetCart·useUpdateCartItemOptions 이전.
// order처럼 담기·초기화가 성공하면 장바구니 조회(주문 유형·범위 전부)를 무효화한다
const invalidateCartQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: [...orderQueryKeys.all, 'cart'] });

// 서버가 주문을 만들며 장바구니를 비운다. 바로 다시 받으면 결과 화면으로 넘어가는 동안 결제 화면이 빈 장바구니로
// 바뀌므로, 오래된 것으로 표시만 하고 다음에 장바구니를 볼 때 다시 받는다
const markCartQueriesStale = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: [...orderQueryKeys.all, 'cart'], refetchType: 'none' });

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

  // KOIN_ORDER_WEBVIEW useOffCampusDeliveryValidate·useUserDeliveryAddress 이전(배달지 선택)
  validateOffCampusDeliveryAddress: () =>
    mutationOptions({
      mutationFn: (data: OffCampusDeliveryValidateRequest) => validateOffCampusDeliveryAddress(data),
    }),

  registerOffCampusDeliveryAddress: () =>
    mutationOptions({
      mutationFn: (data: OffCampusDeliveryAddressRequest) => registerOffCampusDeliveryAddress(data),
    }),

  // 결제하기에서 계좌이체 주문 생성. 이동은 화면에서 정한다
  createDeliveryOrder: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: DeliveryOrderRequest) => createDeliveryOrder(data),
      onSuccess: () => markCartQueriesStale(queryClient),
    }),

  createTakeoutOrder: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: TakeoutOrderRequest) => createTakeoutOrder(data),
      onSuccess: () => markCartQueriesStale(queryClient),
    }),

  // KOIN_ORDER_WEBVIEW useSendSmsVerification 이전(연락처 변경 인증). order와 같은 경로·본문을 쓴다
  sendSmsVerification: () =>
    mutationOptions({
      mutationFn: (phoneNumber: string) => smsSend({ phone_number: phoneNumber }),
    }),

  verifySmsCode: () =>
    mutationOptions({
      mutationFn: ({ phone, code }: { phone: string; code: string }) =>
        smsVerify({ phone_number: phone, verification_code: code }),
    }),

  // KOIN_ORDER_WEBVIEW pages/OrderFinish/hooks/useCancelPayment 이전(주문 취소). 이동은 화면에서 정한다
  cancelPayment: (paymentId: number) =>
    mutationOptions({
      mutationFn: (data: CancelPaymentRequest) => cancelPayment(paymentId, data),
    }),
};
