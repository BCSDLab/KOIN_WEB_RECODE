import { APIResponse } from 'interfaces/APIResponse';

export interface StoreDetailResponse extends APIResponse {
  weekend_open_time: string | null,
  created_at: string,
  description: string,
  image_urls: string[],
  address: string,
  open_time: string,
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
  close_time: string,
}

export interface StoreListResponse extends APIResponse {
  shops:
  { // weekend_open_time: null
    created_at : string,
    description : string,
    image_urls: string[],
    open_time: string,
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
    close_time: string,
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
