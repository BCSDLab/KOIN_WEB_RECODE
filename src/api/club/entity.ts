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

export interface NewClubData {
  name: string;
  image_url: string;
  club_managers: {
    user_id: string;
  }[];
  club_category_id: number;
  location: string;
  description: string;
  instagram?: string;
  google_form?: string;
  open_chat?: string;
  phone_number?: string;
  role:string;
}

export interface PostClubResponse extends APIResponse {
}
