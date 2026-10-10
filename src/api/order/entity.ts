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

// KOIN_ORDER_WEBVIEW api/delivery/entity 이전(배달지 선택)
export const CAMPUS_ADDRESS_CATEGORIES = ['DORMITORY', 'COLLEGE_BUILDING', 'ETC'] as const;

export type CampusAddressCategory = (typeof CAMPUS_ADDRESS_CATEGORIES)[number];

/** 요청/응답 참고: https://business.juso.go.kr/addrlink/openApi/searchApi.do */
export interface Juso {
  bd_nm: string;
  emd_nm: string;
  eng_address: string;
  jibun_address: string;
  li_nm: string;
  rn: string;
  road_address: string;
  sgg_nm: string;
  si_nm: string;
  zip_no: string;
}

export interface AddressSearchResponse {
  addresses: Juso[];
  count_per_page: number;
  current_page: number;
  total_count: string;
}

export interface CampusDeliveryAddress {
  id: number;
  type: '기숙사' | '공학관' | '그 외';
  full_address: string;
  short_address: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface CampusDeliveryAddressResponse {
  count: number;
  addresses: CampusDeliveryAddress[];
}

export interface OffCampusDeliveryValidateRequest {
  si_do: string;
  si_gun_gu: string;
  eup_myeon_dong: string;
  building: string;
}

export interface OffCampusDeliveryAddressRequest {
  zip_number: string;
  si_do: string;
  si_gun_gu: string;
  eup_myeon_dong: string;
  road: string;
  building: string;
  address: string;
  detail_address: string;
  // order는 스토어의 교외 주소(좌표 포함)를 그대로 보낸다
  longitude: number;
  latitude: number;
}

// KOIN_ORDER_WEBVIEW api/auth·shop·delivery·payments/entity 이전(결제 화면)
export interface StudentInfoResponse {
  id: number;
  login_id: string;
  anonymous_nickname: string;
  email: string;
  gender: 0 | 1;
  major: string;
  name: string;
  nickname: string;
  phone_number: string;
  student_number: string;
  user_type: 'STUDENT';
}

export interface ShopDeliveryInfoResponse {
  campus_delivery: boolean;
  off_campus_delivery: boolean;
}

export interface RiderMessageResponse {
  count: number;
  contents: Array<{ content: string }>;
}

export interface DeliveryTemporaryRequest {
  address: string;
  address_detail: string;
  longitude: number;
  latitude: number;
  phone_number: string;
  to_owner: string;
  to_rider: string;
  total_menu_price: number;
  delivery_type: 'CAMPUS' | 'OFF_CAMPUS';
  delivery_tip: number;
  provide_cutlery: boolean;
  total_amount: number;
}

export interface TakeoutTemporaryRequest {
  phone_number: string;
  to_owner: string;
  provide_cutlery: boolean;
  total_menu_price: number;
  total_amount: number;
}

export interface TemporaryPaymentResponse {
  order_id: string;
}

// KOIN_ORDER_WEBVIEW api/payments/entity 이전(결제 승인)
export interface ConfirmPaymentRequest {
  order_id: string;
  payment_key: string;
  amount: number;
}

export interface ConfirmPaymentResponse {
  id: number;
  orderable_shop_id: number;
  delivery_address: string;
  delivery_address_details: string;
  shop_address: string;
  longitude: number;
  latitude: number;
  to_owner: string;
  to_rider: string;
  provide_cutlery: boolean;
  total_menu_price: number;
  delivery_tip: number;
  amount: number;
  shop_name: string;
  menus: Array<{
    name: string;
    quantity: number;
    price: number;
    options: Array<{
      option_group_name: string;
      option_name: string;
      option_price: number;
    }>;
  }>;
  order_type: OrderType;
  easy_pay_company: string;
  requested_at: string;
  approved_at: string;
  payment_method: string;
  estimated_at: string;
}

// KOIN_ORDER_WEBVIEW api/payments getPaymentInfo 이전(주문 완료·결과 화면).
// 포장 주문은 배달지·좌표·배달비·도착 예정 시각이 null로 온다(order 타입 선언은 non-null)
export type OrderStatus = 'CONFIRMING' | 'COOKING' | 'PACKAGED' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'CANCELED';

export interface PaymentInfoResponse {
  id: number;
  orderable_shop_id: number;
  delivery_address: string | null;
  delivery_address_details: string | null;
  shop_address: string;
  longitude: number | null;
  latitude: number | null;
  to_owner: string;
  to_rider: string | null;
  provide_cutlery: boolean;
  total_menu_price: number;
  delivery_tip: number | null;
  amount: number;
  shop_name: string;
  menus: Array<{
    name: string;
    quantity: number;
    price: number;
    options: Array<{
      option_group_name: string;
      option_name: string;
      option_price: number | null;
    }> | null;
  }>;
  order_type: OrderType;
  easy_pay_company: string;
  requested_at: string;
  approved_at: string;
  payment_method: string;
  estimated_at: string | null;
  order_status: OrderStatus;
}

// KOIN_ORDER_WEBVIEW api/payments cancelPayment 이전(주문 취소)
export interface CancelPaymentRequest {
  cancel_reason: string;
}

export interface CancelPaymentResponse {
  payment_cancels: Array<{
    id: number;
    cancel_reason: string;
    cancel_amount: number;
    canceled_at: string;
  }>;
}
