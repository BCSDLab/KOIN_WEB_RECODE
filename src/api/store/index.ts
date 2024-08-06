import APIClient from 'utils/ts/apiClient';
import {
  StoreList, StoreDetailInfo, StoreDetailMenu, StoreCategories, AllStoreEvent,
  StoreEventList,
  ReviewList,
  DeleteReview,
} from './APIDetail';

export const getStoreList = APIClient.of(StoreList);

export const getStoreDetailInfo = APIClient.of(StoreDetailInfo);

export const getStoreDetailMenu = APIClient.of(StoreDetailMenu);

export const getStoreCategories = APIClient.of(StoreCategories);

export const getAllEvent = APIClient.of(AllStoreEvent);

export const getStoreEventList = APIClient.of(StoreEventList);

export const getReviewList = APIClient.of(ReviewList);

export const deleteReview = APIClient.of(DeleteReview);
