import APIClient from 'utils/ts/apiClient';

import {
  AddCart,
  Cart,
  CartItemOptions,
  CartSummary,
  DeleteCartItem,
  OrderShopMenuDetail,
  ResetCart,
  UpdateCartItemOptions,
  UpdateCartItemQuantity,
  ValidateCart,
} from './APIDetail';

export const getCart = APIClient.of(Cart);

export const getCartSummary = APIClient.of(CartSummary);

export const getOrderShopMenuDetail = APIClient.of(OrderShopMenuDetail);

export const addCart = APIClient.of(AddCart);

export const resetCart = APIClient.of(ResetCart);

export const updateCartItemQuantity = APIClient.of(UpdateCartItemQuantity);

export const deleteCartItem = APIClient.of(DeleteCartItem);

export const validateCart = APIClient.of(ValidateCart);

export const getCartItemOptions = APIClient.of(CartItemOptions);

export const updateCartItemOptions = APIClient.of(UpdateCartItemOptions);
