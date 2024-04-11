import APIClient from 'utils/ts/apiClient';
import {
<<<<<<< HEAD
  StoreList, StoreDetailInfo, StoreDetailMenu, StoreCategories, StoreEventList,
=======
  StoreList, StoreDetailInfo, StoreDetailMenu, StoreCategories, AllStoreEvent,
>>>>>>> origin/develop
} from './APIDetail';

export const getStoreList = APIClient.of(StoreList);

export const getStoreDetailInfo = APIClient.of(StoreDetailInfo);

export const getStoreDetailMenu = APIClient.of(StoreDetailMenu);

export const getStoreCategories = APIClient.of(StoreCategories);

<<<<<<< HEAD
export const getStoreEventList = APIClient.of(StoreEventList);
=======
export const getAllEvent = APIClient.of(AllStoreEvent);
>>>>>>> origin/develop
