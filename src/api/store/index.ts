import APIClient from 'utils/ts/apiClient';
import {
  StoreList, StoreListV2, StoreDetailInfo, StoreDetailMenu, StoreCategories, AllStoreEvent,
  StoreEventList,
  ReviewList,
  ReviewReport,
} from './APIDetail';

export const getStoreList = APIClient.of(StoreList);

export const getStoreListV2 = APIClient.of(StoreListV2);

export const getStoreDetailInfo = APIClient.of(StoreDetailInfo);

export const getStoreDetailMenu = APIClient.of(StoreDetailMenu);

export const getStoreCategories = APIClient.of(StoreCategories);

export const getAllEvent = APIClient.of(AllStoreEvent);

export const getStoreEventList = APIClient.of(StoreEventList);

export const getReviewList = APIClient.of(ReviewList);

export const postReviewReport = APIClient.of(ReviewReport);
