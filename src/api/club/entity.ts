import type { APIResponse } from 'interfaces/APIResponse';

export interface ClubCategory {
  id: number;
  name: string;
}

export interface ClubCategoriesResponse extends APIResponse {
  club_categories: ClubCategory[];
}

export interface ClubCategoryInfo {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

export interface ClubListResponse extends APIResponse {
  clubs: ClubCategoryInfo[];
}

export interface HotClubResponse extends APIResponse {
  club_id: number;
  name: string;
  image_url: string;
}
