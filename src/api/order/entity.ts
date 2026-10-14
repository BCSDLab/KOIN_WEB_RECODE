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

// KOIN_ORDER_WEBVIEW api/shop/entity(메뉴 상세)·api/cart/entity(담기·옵션 수정) 이전
export interface MenuPrice {
  id: number;
  name: string | null;
  price: number;
  is_selected: boolean;
}

export interface MenuOptionGroup {
  id: number;
  name: string;
  description?: string | null;
  is_required: boolean;
  min_select: number;
  max_select: number;
  options: MenuPrice[];
}

export interface ShopMenuDetailResponse {
  id: number;
  quantity: number;
  name: string;
  description: string | null;
  images: string[];
  prices: MenuPrice[];
  option_groups: MenuOptionGroup[];
}

export interface AddCartRequest {
  orderable_shop_id: number;
  orderable_shop_menu_id: number;
  orderable_shop_menu_price_id: number;
  orderable_shop_menu_option_ids: Array<{
    option_group_id: number;
    option_id: number;
  }>;
  quantity: number;
}

export interface UpdateCartItemRequest {
  orderable_shop_menu_price_id: number;
  quantity: number;
  options: Array<{
    option_group_id: number;
    option_id: number;
  }>;
}
