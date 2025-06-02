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
  is_like_hidden:boolean;
}

export interface PostClubResponse extends APIResponse {
}

export interface ClubDetailResponse extends APIResponse {
  id: number;
  name: string;
  category: string;
  location: string;
  image_url: string;
  likes: number;
  description: string;
  introduction: string;
  instagram: string | null;
  google_form: string | null;
  open_chat: string | null;
  phone_number: string | null;
  manager: boolean;
  is_liked: boolean;
  updated_at: string;
}
