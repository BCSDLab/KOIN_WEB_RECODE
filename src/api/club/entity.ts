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
  image_url: string;
  is_liked: boolean;
  is_like_hidden:boolean;
  recruitment_info: {
    status: 'NONE' | 'BEFORE' | 'RECRUITING' | 'CLOSED' | 'ALWAYS';
    dday: number;
  };
}
export interface ClubListResponse extends APIResponse {
  clubs: Club[];
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
  is_like_hidden: boolean;
  hot_status?: {
    month: number;
    week_of_month: number;
    streak_count: number;
  } | null;
}

export type PutClubLikeResonse = APIResponse;

export type DeleteClubLikeResonse = APIResponse;

export interface ClubInroductionData {
  introduction : string;
}

export interface ClubQnAData {
  root_count: number;

  total_count: number;

  qnas: ClubQnAItem[];
}

export interface ClubQnAItem {
  id: number;
  author_id: number;
  nickname: string;
  content: string;
  created_at: string;
  children: ClubQnAItem[];
}

export interface ClubNewQnA {
  parent_id: number | null,
  content: string
}

export type PostClubQnAResponse = APIResponse;

export type DeleteClubQnAResponse = APIResponse;

export interface NewClubManager {
  club_id: number;
  changed_manager_id: string;
}
export type NewClubManagerResponse = APIResponse;
