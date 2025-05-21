import type { APIResponse } from 'interfaces/APIResponse';

export interface ClubCategory {
  id: number;
  name: string;
}

export interface ClubCategoriesResponse extends APIResponse {
  club_categories: ClubCategory[];
}

export interface Club {
  id: number;
  name: string;
  category: string;
  likes: number;
  imageUrl: string;
  isLiked: boolean;
}

export interface ClubListResponse extends APIResponse {
  clubs: Club[];
}

export interface HotClubResponse extends APIResponse {
  club_id: number;
  name: string;
  image_url: string;
}

export interface AddClubLikeResponse extends APIResponse { }

export interface CancelClubLikeResponse extends APIResponse { }
