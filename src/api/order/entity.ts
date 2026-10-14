// KOIN_ORDER_WEBVIEW api/cart/entity 이전
export type OrderType = 'DELIVERY' | 'TAKE_OUT';

export interface CartItem {
  cart_menu_item_id: number;
  orderable_shop_menu_id: number;
  name: string;
  menu_thumbnail_image_url: string | null;
  quantity: number;
  total_amount: number;
  price: {
    name: string | null;
    price: number;
  };
  options: Array<{
    option_group_name: string;
    option_name: string;
    option_price: number;
  }>;
  is_modified: boolean;
}

export interface CartResponse {
  shop_name: string;
  shop_thumbnail_image_url: string;
  orderable_shop_id: number;
  is_delivery_available: boolean;
  is_takeout_available: boolean;
  shop_minimum_order_amount: number;
  items: CartItem[];
  items_amount: number;
  delivery_fee: number;
  total_amount: number;
  final_payment_amount: number;
}

export interface CartSummaryResponse {
  orderable_shop_id: number;
  shop_minimum_order_amount: number;
  cart_items_amount: number;
  is_available: boolean;
}
