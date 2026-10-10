import APIClient from 'utils/ts/apiClient';

import { Cart, CartSummary } from './APIDetail';

export const getCart = APIClient.of(Cart);

export const getCartSummary = APIClient.of(CartSummary);
