import APIClient from 'utils/ts/apiClient';
import {
  StoreList, StoreDetailInfo, StoreDetailMenu, StoreCategories, AllStoreEvent,
} from './APIDetail';

export const getStoreList = APIClient.of(StoreList);

export const getStoreDetailInfo = APIClient.of(StoreDetailInfo);

export const getStoreDetailMenu = APIClient.of(StoreDetailMenu);

export const getStoreCategories = APIClient.of(StoreCategories);

export const getAllEvent = APIClient.of(AllStoreEvent);
