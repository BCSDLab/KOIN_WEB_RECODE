import APIClient from 'utils/ts/apiClient';

import {
  AddCart,
  AddressSearch,
  CampusDeliveryAddresses,
  Cart,
  CartItemOptions,
  CartSummary,
  ConfirmPayment,
  DeleteCartItem,
  OffCampusDeliveryValidate,
  OrderShopMenuDetail,
  RegisterOffCampusDeliveryAddress,
  ResetCart,
  RiderMessages,
  ShopDeliveryInfo,
  StudentInfo,
  TemporaryDeliveryPayment,
  TemporaryTakeoutPayment,
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

export const searchAddress = APIClient.of(AddressSearch);

export const getCampusDeliveryAddresses = APIClient.of(CampusDeliveryAddresses);

export const validateOffCampusDeliveryAddress = APIClient.of(OffCampusDeliveryValidate);

export const registerOffCampusDeliveryAddress = APIClient.of(RegisterOffCampusDeliveryAddress);

export const getStudentInfo = APIClient.of(StudentInfo);

export const getShopDeliveryInfo = APIClient.of(ShopDeliveryInfo);

export const getRiderMessages = APIClient.of(RiderMessages);

export const createTemporaryDeliveryPayment = APIClient.of(TemporaryDeliveryPayment);

export const createTemporaryTakeoutPayment = APIClient.of(TemporaryTakeoutPayment);

export const confirmPayment = APIClient.of(ConfirmPayment);
