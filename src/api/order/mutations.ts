import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import { smsSend, smsVerify } from 'api/auth';

import type {
  AddCartRequest,
  ConfirmPaymentRequest,
  DeliveryTemporaryRequest,
  OffCampusDeliveryAddressRequest,
  OffCampusDeliveryValidateRequest,
  OrderType,
  TakeoutTemporaryRequest,
  UpdateCartItemRequest,
} from './entity';
import {
  addCart,
  confirmPayment,
  createTemporaryDeliveryPayment,
  createTemporaryTakeoutPayment,
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

  // KOIN_ORDER_WEBVIEW useTemporaryDelivery·useTemporaryTakeout 이전(결제하기에서 임시 주문 생성)
  createTemporaryDeliveryPayment: () =>
    mutationOptions({
      mutationFn: (data: DeliveryTemporaryRequest) => createTemporaryDeliveryPayment(data),
    }),

  createTemporaryTakeoutPayment: () =>
    mutationOptions({
      mutationFn: (data: TakeoutTemporaryRequest) => createTemporaryTakeoutPayment(data),
    }),

  // KOIN_ORDER_WEBVIEW useConfirmPayments 이전(결제 승인). 성공·실패 후 이동은 화면에서 정한다
  confirmPayment: () =>
    mutationOptions({
      mutationFn: (data: ConfirmPaymentRequest) => confirmPayment(data),
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
};
