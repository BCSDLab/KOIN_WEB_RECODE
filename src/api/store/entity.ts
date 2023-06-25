import { APIResponse } from 'interfaces/APIResponse';

interface Open {
  open_time: string,
  close_time: string,
  closed: boolean,
  day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
}

export interface StoreDetailResponse extends APIResponse {
  weekend_open_time: string | null,
  created_at: string,
  description: string,
  image_urls: string[],
  address: string,
  weekend_close_time: string | null,
  pay_bank: boolean,
  hit: number,
  internal_name: string,
  is_deleted: false,
  updated_at: string,
  chosung: string,
  id: number,
  menus: {
    shop_id: number,
    is_deleted: boolean,
    updated_at: string,
    name: string,
    created_at: string,
    price_type: {
      size: string,
      price: string,
    }[],
    id: number,
  }[],
  name: string,
  pay_card: boolean,
  phone: string,
  delivery: boolean,
  delivery_price: number,
  open: Open[],
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

type Menu = SinglePriceMenu | MultiPriceMenu;

interface MenuCategory {
  id: number;
  name: string;
  menus: Menu[];
}

export interface StoreDetailMenuResponse extends APIResponse {
  count: number;
  menu_categories: MenuCategory[];
}

export interface StoreListResponse extends APIResponse {
  shops:
  { // weekend_open_time: null
    created_at : string,
    description : string,
    image_urls: string[],
    open: Open[],
    // weekend_close_time: null,
    pay_bank: boolean,
    hit: number,
    internal_name: string,
    is_deleted: boolean,
    updated_at: string,
    chosung: string,
    id: number,
    delivery: boolean,
    address: string,
    pay_card: boolean,
    is_event: boolean,
    event_articles: {}[],
    phone: string,
    name: string,
    category: string,
    permalink: string,
    // remarks: null,
    delivery_price: number
  }[]
}
