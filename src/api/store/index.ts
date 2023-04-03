import { APIClient } from 'utils/ts/apiClient';
import { StoreList, StoreDetailInfo } from './APIDetail';

export const getStoreList = APIClient.of(StoreList);

export const getStoreDetailInfo = APIClient.of(StoreDetailInfo);
