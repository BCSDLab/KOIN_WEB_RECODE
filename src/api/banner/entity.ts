import { APIResponse } from 'interfaces/APIResponse';

export type BannerCategories = {
  id: number;
  name: string;
};

export type Banners = {
  id: number;
  image_url: string;
  redirect_link: string | null;
  version: string | null;
};

export interface BannerCategoriesResponse extends APIResponse {
  banner_categories: BannerCategories[];
}

export interface BannersResponse extends APIResponse {
  count: number;
  banners: Banners[];
}
