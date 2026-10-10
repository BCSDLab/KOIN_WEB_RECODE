import APIClient from 'utils/ts/apiClient';

import {
  AddCart,
  Cart,
  CartItemOptions,
  CartSummary,
  OrderShopMenuDetail,
  ResetCart,
  UpdateCartItemOptions,
} from './APIDetail';

export const getCart = APIClient.of(Cart);

export const getCartSummary = APIClient.of(CartSummary);

export const getOrderShopMenuDetail = APIClient.of(OrderShopMenuDetail);

export const addCart = APIClient.of(AddCart);

export const resetCart = APIClient.of(ResetCart);

export const getCartItemOptions = APIClient.of(CartItemOptions);

export const updateCartItemOptions = APIClient.of(UpdateCartItemOptions);
