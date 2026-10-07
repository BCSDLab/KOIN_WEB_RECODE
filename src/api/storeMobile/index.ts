import APIClient from 'utils/ts/apiClient';

import {
  OrderShopDetail,
  OrderShopMenuGroups,
  OrderShopMenus,
  OrderShopSummary,
  ShopCategories,
  ShopDetailV2,
  ShopEvents,
  ShopListV3,
  ShopMenus,
  ShopRelatedSearch,
  ShopReviewDetail,
  ShopReviewReportCategories,
  ShopReviews,
  ShopSummary,
} from './APIDetail';

export const getShopCategories = APIClient.of(ShopCategories);

export const getShopListV3 = APIClient.of(ShopListV3);

export const getShopRelatedSearch = APIClient.of(ShopRelatedSearch);

export const getShopSummary = APIClient.of(ShopSummary);

export const getShopDetailV2 = APIClient.of(ShopDetailV2);

export const getShopMenus = APIClient.of(ShopMenus);

export const getShopEvents = APIClient.of(ShopEvents);

export const getShopReviews = APIClient.of(ShopReviews);

export const getShopReviewReportCategories = APIClient.of(ShopReviewReportCategories);

export const getShopReviewDetail = APIClient.of(ShopReviewDetail);

export const getOrderShopSummary = APIClient.of(OrderShopSummary);

export const getOrderShopMenuGroups = APIClient.of(OrderShopMenuGroups);

export const getOrderShopMenus = APIClient.of(OrderShopMenus);

export const getOrderShopDetail = APIClient.of(OrderShopDetail);
