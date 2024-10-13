import APIClient from 'utils/ts/apiClient';
import { CoopShopCafeteria, CoopShop } from './APIDetail';

export const getCafeteriaInfo = APIClient.of(CoopShopCafeteria);
export const getAllShopInfo = APIClient.of(CoopShop);
