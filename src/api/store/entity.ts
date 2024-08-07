import { APIResponse } from 'interfaces/APIResponse';

interface Open {
  open_time: string;
  close_time: string;
  closed: boolean;
  day_of_week:
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';
}

export interface StoreDetailResponse extends APIResponse {
  address: string;
  delivery: boolean;
  delivery_price: number;
  description: string;
  id: number;
  image_urls: string[];
  menu_categories: MenuCategory[];
  name: string;
  open: Open[];
  pay_bank: boolean;
  pay_card: boolean;
  phone: string;
  shop_categories: StoreCategory[];
  updated_at: string;
  bank?: string;
  account_number?: string;
}

interface MenuBase {
  id: number;
  name: string;
  image_urls: string[];
  is_hidden: boolean;
  is_single: boolean;
  description: string | null;
}

interface SinglePriceMenu extends MenuBase {
  single_price: number;
  option_prices: null;
}

interface MultiPriceMenu extends MenuBase {
  single_price: null;
  option_prices: { option: string; price: number }[];
}

export type Menu = SinglePriceMenu | MultiPriceMenu;

export type MenuCategoryName =
  | '추천 메뉴'
  | '메인 메뉴'
  | '세트 메뉴'
  | '사이드 메뉴';
export interface MenuCategory {
  id: number;
  name: MenuCategoryName;
  menus: Menu[];
}

export interface StoreDetailMenuResponse extends APIResponse {
  count: number;
  menu_categories: MenuCategory[];
  updated_at: string;
}

export type StoreList = {
  id: number;
  name: string;
  phone: string;
  delivery: boolean;
  pay_card: boolean;
  pay_bank: boolean;
  open: Open[];
  category_ids: number[];
  is_event: boolean;
  is_open: boolean;
};

export interface StoreListResponse extends APIResponse {
  count: number;
  shops: StoreList[];
}

export interface StoreCategoriesResponse extends APIResponse {
  total_count: number;
  shop_categories: StoreCategory[];
}

export interface StoreCategory {
  id: number;
  name: string;
  image_url: string;
}

export interface StoreEvent {
  shop_id: number;
  shop_name: string;
  title: string;
  content: string;
  thumbnail_images: string[];
  start_date: string;
  end_date: string;
}

export interface AllStoreEventResponse extends APIResponse {
  events: {
    shop_id: number;
    event_id: number;
    shop_name: string;
    title: string;
    content: string;
    thumbnail_images: string[];
    start_date: string;
    end_date: string;
  }[];
}

export interface StoreEventListResponse extends APIResponse {
  events: StoreEvent[];
}

export interface ReviewListResponse extends APIResponse {
  total_count: number,
  current_count: number,
  total_page: number,
  current_page: number,
  statistics: {
    average_rating: number,
    ratings: {
      1: number,
      2: number,
      3: number,
      4: number,
      5: number
    }
  },
  reviews: Review[]
}

export interface Review {
  review_id: number,
  rating: number,
  nick_name: string,
  content: string,
  image_urls: [
    string,
  ],
  menu_names: [
    string,
  ],
  is_mine: boolean,
  is_modified: boolean,
  created_at: string
}

export interface ReviewReportRequest {
  reports: Array<{
    title: string;
    content: string;
  }>;
}

export interface ReviewReportResponse extends APIResponse { }
