import APIClient from 'utils/ts/apiClient';
import {
  StoreList, StoreListV2, StoreDetailInfo, StoreDetailMenu, StoreCategories, AllStoreEvent,
  StoreEventList,
  StoreBenefitList, StoreBenefitCategory,
  ReviewList,
  DeleteReview,
  GetMyReviews,
  ReviewReport,
  GetRelatedSearchItem,
} from './APIDetail';

export const getStoreList = APIClient.of(StoreList);

export const getStoreListV2 = APIClient.of(StoreListV2);

export const getStoreDetailInfo = APIClient.of(StoreDetailInfo);

export const getStoreDetailMenu = APIClient.of(StoreDetailMenu);

export const getStoreBenefitList = APIClient.of(StoreBenefitList);

export const getStoreBenefitCategory = APIClient.of(StoreBenefitCategory);

export const getStoreCategories = APIClient.of(StoreCategories);

export const getAllEvent = APIClient.of(AllStoreEvent);

export const getStoreEventList = APIClient.of(StoreEventList);

export const getReviewList = APIClient.of(ReviewList);

export const deleteReview = APIClient.of(DeleteReview);

export const getMyReview = APIClient.of(GetMyReviews);

export const postReviewReport = APIClient.of(ReviewReport);

export const getRelateSearch = APIClient.of(GetRelatedSearchItem);
