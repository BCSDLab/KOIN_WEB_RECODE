// KOIN_ORDER_WEBVIEW src/api/shop/entity.ts (오라클 패치 적용본)에서 옮긴 모바일 상점·주문 화면 응답 타입
export interface ShopDetailInfoParams {
  orderableShopId: number;
}

interface DeliveryTips {
  from_amount: number;
  to_amount: number;
  fee: number;
}

interface OwnerInfo {
  name: string;
  shop_name: string;
  address: string;
  company_registration_number: string;
}

interface OriginInfo {
  ingredient: string;
  origin: string;
}

export type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ShopDetailInfoResponse {
  shop_id: number;
  orderable_shop_id: number | null;
  name: string;
  address: string;
  open_time: string;
  close_time: string;
  closed_days: Day[];
  phone: string;
  introduction: string | null;
  notice: string | null;
  delivery_tips: DeliveryTips[] | [];
  owner_info: OwnerInfo;
  origins: OriginInfo[] | [];
}

export interface Time {
  day_of_week: Day;
  closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

export interface CategoryGroup {
  id: number;
  name: string;
}

export interface UnorderableShopDetailInfoResponse {
  address: string;
  delivery: boolean;
  delivery_price: number;
  description: string;
  id: number;
  image_urls: string[];
  menu_categories: MenuGroup[];
  name: string;
  open: Time[];
  pay_bank: boolean;
  pay_card: boolean;
  phone: string;
  main_category_id: number;
  shop_categories: CategoryGroup[];
  updated_at: string;
  is_event: boolean;
  bank: string | null;
  account_number: string | null;
  open_time?: string;
  close_time?: string;
}

interface Rating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

interface ReviewStatistics {
  average_rating: number;
  ratings: Rating;
}

export interface Review {
  review_id: number;
  rating: number;
  nick_name: string;
  content: string;
  image_urls: string[];
  menu_names: string[];
  is_mine: boolean;
  is_modified: boolean;
  is_reported: boolean;
  created_at: string;
}

export interface UnorderableShopReviewsResponse {
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
  statistics: ReviewStatistics;
  reviews: Review[];
}

export interface ShopDeliveryInfoResponse {
  campus_delivery: boolean;
  off_campus_delivery: boolean;
}

export interface OrderableShopInfoParams {
  orderableShopId: number;
  orderableShopMenuId?: number;
}

export interface UnorderableShopInfoParams {
  UnorderableShopId: number;
}

export interface Events {
  shop_id: number;
  shop_name: string;
  event_id: number;
  title: string;
  content: string;
  thumbnail_images: string[];
  start_date: string;
  end_date: string;
}

export interface ShopEventsResponse {
  events: Events[];
}

export interface Price {
  id: number;
  name: string | null;
  price: number;
  is_selected: boolean;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  thumbnail_image: string;
  is_sold_out: boolean;
  prices: Price[];
}

export interface ShopInfoResponse {
  menu_group_id: number;
  menu_group_name: string;
  menus: Menu[];
}

interface UnorderableOptions {
  option: string;
  price: number;
}

export interface UnorderableMenu {
  id: number;
  name: string;
  is_hidden: boolean;
  is_single: boolean;
  single_price: number;
  option_prices: UnorderableOptions[];
  description: string | null;
  image_urls: string[];
}

interface UnorderableMenuCategory {
  id: number;
  name: string;
  menus: UnorderableMenu[];
}

export interface UnorderableShopMenusResponse {
  count: number;
  menu_categories: UnorderableMenuCategory[];
  updated_at: string;
}

interface Image {
  image_url: string;
  is_thumbnail: boolean;
}

export interface ShopInfoSummaryResponse {
  shop_id: number;
  orderable_shop_id?: number;
  name: string;
  introduction: string | null;
  pay_card: boolean;
  pay_bank: boolean;
  is_delivery_available?: boolean;
  is_takeout_available?: boolean;
  minimum_order_amount?: number;
  rating_average: number;
  review_count: number;
  minimum_delivery_tip?: number;
  maximum_delivery_tip?: number;
  images: Image[];
}

interface MenuGroup {
  id: number;
  name: string;
}

export interface ShopMenuGroupsResponse {
  count: number;
  menu_groups: MenuGroup[];
}

export interface OptionGroup {
  id: number;
  name: string;
  description?: string | null;
  is_required: boolean;
  min_select: number;
  max_select: number;
  options: Price[];
}

export interface ShopMenuDetailResponse {
  id: number;
  quantity: number;
  name: string;
  description: string | null;
  images: string[];
  prices: Price[];
  option_groups: OptionGroup[];
}

export interface NearbyStoresRelateSearchParams {
  keyword: string;
}

export interface NearbyStoresRelateSearchResponse {
  search_keyword: string;
  processed_search_keyword: string;
  shop_name_search_result_count: number;
  menu_name_search_result_count: number;
  shop_name_search_results: NearByShopResult[];
  menu_name_search_results: NearByShopMenuResult[];
}

export interface NearByShopResult {
  shop_id: number;
  shop_name: string;
}

export interface NearByShopMenuResult {
  shop_id: number;
  shop_name: string;
  menu_name: string;
}

export interface RelatedSearchResponse {
  search_keyword: string;
  processed_search_keyword: string;
  shop_name_search_result_count: number;
  menu_name_search_result_count: number;
  shop_name_search_results: ShopResult[];
  menu_name_search_results: MenuResult[];
}

export interface ShopResult {
  orderable_shop_id: number;
  orderable_shop_name: string;
}

export interface MenuResult {
  orderable_shop_id: number;
  orderable_shop_name: string;
  menu_name: string;
}

export interface RelatedSearchParams {
  keyword: string;
}

export interface ShopCategoriesResponse {
  total_count: number;
  shop_categories: ShopCategory[];
}

export interface ShopCategory {
  id: number;
  name: string;
  image_url: string;
}

export interface OrderableShopsResponse {
  shop_id: number;
  orderable_shop_id: number;
  name: string;
  is_delivery_available: boolean;
  is_takeout_available: boolean;
  service_event: boolean;
  minimum_order_amount: number;
  rating_average: number;
  review_count: number;
  minimum_delivery_tip: number;
  maximum_delivery_tip: number;
  is_open: boolean;
  category_ids: number[];
  images: Image[];
  open_status: 'OPERATING' | 'PREPARING' | 'CLOSED';
}

export interface OrderableShopsParams {
  sorter?: string;
  filter?: OrderableShopsFilter[];
  category_filter?: number;
  minimum_order_amount?: number;
}

export type OrderableShopsFilter = 'IS_OPEN' | 'DELIVERY_AVAILABLE' | 'TAKEOUT_AVAILABLE' | 'FREE_DELIVERY_TIP';

export interface ShopListParams {
  sorter?: string;
  filter?: string;
}

export interface ShopListResponse {
  count: number;
  shops: ShopInfo[];
}

export interface ShopInfo {
  category_ids: number[];
  delivery: boolean;
  id: number;
  name: string;
  pay_bank: boolean;
  pay_card: boolean;
  phone: string;
  open: OpenInfo[];
  is_event: boolean;
  is_open: boolean;
  average_rate: number;
  review_count: number;
  benefit_details: string;
  images: string[];
}

export interface OpenInfo {
  day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  closed: boolean;
  open_time: string;
  close_time: string;
}

export interface ReportReviewRequest {
  reports: Array<{
    title: string;
    content: string;
  }>;
}
export interface ReviewReportCategory {
  name: string;
  detail: string;
}

export interface ReviewReportCategoriesResponse {
  count: number;
  categories: ReviewReportCategory[];
}

export type ReviewSorter = 'LATEST' | 'OLDEST' | 'HIGHEST_RATING' | 'LOWEST_RATING';

export interface GetShopTotalReviewParams {
  shopId: number;
  page: number;
  limit: number;
  sorter: ReviewSorter;
}

export interface GetMyShopReviewsParams {
  shopId: number;
  params: {
    sorter: ReviewSorter;
  };
}

export interface CreateReviewRequest {
  rating: number;
  content: string;
  image_urls: string[];
  menu_names: string[];
}

export interface UploadShopFilesResponse {
  file_urls: string[];
}

export interface ReviewDetailResponse {
  review_id: number;
  rating: number;
  nick_name: string;
  content: string;
  image_urls: string[];
  menu_names: string[];
  is_modified: boolean;
  created_at: string;
}
