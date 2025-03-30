import APIClient from 'utils/ts/apiClient';
import {
  BannerCategoryList,
  Banners,
} from './APIDetail';

export const getBannerCategoryList = APIClient.of(BannerCategoryList);

export const getBanners = APIClient.of(Banners);
