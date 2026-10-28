import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';
import { isUnauthorizedError } from 'utils/ts/httpError';

import type {
  CampusAddressCategory,
  CartResponse,
  OrderableShopsParams,
  OrderHistoryFilter,
  OrderType,
} from './entity';
import {
  getCampusDeliveryAddresses,
  getCart,
  getCartItemOptions,
  getCartSummary,
  getInProgressOrders,
  getOrderableShops,
  getOrderHistory,
  getOrderShopMenuDetail,
  getPaymentInfo,
  getRiderMessages,
  getShopDeliveryInfo,
  getStudentInfo,
  searchAddress,
} from './index';

// 장바구니는 사용자별 응답이라 getViewerScope로 범위를 키에 넣는다(SSR·클라이언트 키 일치)
export const orderQueryKeys = {
  all: ['order'] as const,
  cart: (orderType: OrderType, scope: 'auth' | 'guest') => [...orderQueryKeys.all, 'cart', scope, orderType] as const,
  cartSummary: (orderableShopId: string, scope: 'auth' | 'guest') =>
    [...orderQueryKeys.all, 'cart-summary', scope, orderableShopId] as const,
  menuDetail: (shopId: string, menuId: string) => [...orderQueryKeys.all, 'menu-detail', shopId, menuId] as const,
  cartItemOptions: (cartMenuItemId: string) => [...orderQueryKeys.all, 'cart-item-options', cartMenuItemId] as const,
  // 배달지 목록·주소 검색은 로그인과 무관한 공개 데이터라 범위를 키에 넣지 않는다
  campusDeliveryAddresses: (filter: CampusAddressCategory) =>
    [...orderQueryKeys.all, 'campus-delivery-addresses', filter] as const,
  addressSearch: (keyword: string) => [...orderQueryKeys.all, 'address-search', keyword] as const,
  // 결제 화면. 학생 정보·라이더 요청 문구는 로그인 사용자 요청이라 범위를 키에 넣는다
  studentInfo: (scope: 'auth' | 'guest') => [...orderQueryKeys.all, 'student-info', scope] as const,
  riderMessages: (scope: 'auth' | 'guest') => [...orderQueryKeys.all, 'rider-messages', scope] as const,
  shopDeliveryInfo: (orderableShopId: number) =>
    [...orderQueryKeys.all, 'shop-delivery-info', orderableShopId] as const,
  // 주문 결과는 로그인 사용자 요청이라 범위를 키에 넣는다
  paymentInfo: (paymentId: number, scope: 'auth' | 'guest') =>
    [...orderQueryKeys.all, 'payment-info', scope, paymentId] as const,
  // 주문 내역은 로그인 사용자 요청이라 범위를 키에 넣는다. 지난 주문은 필터·검색어별로 따로 캐시한다
  orderHistory: (filter: OrderHistoryFilter, scope: 'auth' | 'guest') =>
    [...orderQueryKeys.all, 'order-history', scope, filter] as const,
  inProgressOrders: (scope: 'auth' | 'guest') => [...orderQueryKeys.all, 'in-progress-orders', scope] as const,
  // 주문 홈 상점 목록은 공개 데이터라 범위를 키에 넣지 않는다. 조건(카테고리·필터·정렬·최소주문금액)별로 따로 캐시한다
  orderableShops: (params: OrderableShopsParams) => [...orderQueryKeys.all, 'orderable-shops', params] as const,
};

// order useCart의 dummyCart: 비로그인(401)이면 빈 장바구니로 그린다
export const EMPTY_CART: CartResponse = {
  shop_name: '',
  shop_thumbnail_image_url: '',
  orderable_shop_id: 0,
  is_delivery_available: false,
  is_takeout_available: false,
  shop_minimum_order_amount: 0,
  items: [],
  total_amount: 0,
  items_amount: 0,
  delivery_fee: 0,
  final_payment_amount: 0,
};

export const orderQueries = {
  cart: (orderType: OrderType, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.cart(orderType, getViewerScope(isLoggedIn)),
      queryFn: async () => {
        try {
          return await getCart(orderType, isLoggedIn);
        } catch (error) {
          if (isUnauthorizedError(error)) return EMPTY_CART;
          throw error;
        }
      },
    }),
  cartSummary: (orderableShopId: string, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.cartSummary(orderableShopId, getViewerScope(isLoggedIn)),
      queryFn: () => getCartSummary(orderableShopId),
    }),
  // 메뉴 상세는 공개 데이터라 범위를 키에 넣지 않는다
  menuDetail: (shopId: string, menuId: string) =>
    queryOptions({
      queryKey: orderQueryKeys.menuDetail(shopId, menuId),
      queryFn: () => getOrderShopMenuDetail(shopId, menuId),
    }),
  cartItemOptions: (cartMenuItemId: string, enabled: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.cartItemOptions(cartMenuItemId),
      queryFn: () => getCartItemOptions(cartMenuItemId),
      enabled,
    }),
  // KOIN_ORDER_WEBVIEW useCampusDeliveryAddress 이전(교내 배달지 분류별 목록)
  campusDeliveryAddresses: (filter: CampusAddressCategory) =>
    queryOptions({
      queryKey: orderQueryKeys.campusDeliveryAddresses(filter),
      queryFn: () => getCampusDeliveryAddresses(filter),
    }),
  // KOIN_ORDER_WEBVIEW useRoadNameAddress 이전. order처럼 자동 조회하지 않고 Enter에서 refetch로만 조회한다
  addressSearch: (keyword: string) =>
    queryOptions({
      queryKey: orderQueryKeys.addressSearch(keyword),
      queryFn: () => searchAddress(keyword, '1', '10'),
      enabled: false,
    }),
  // KOIN_ORDER_WEBVIEW pages/Payment/hooks/useStudentInfo 이전(연락처 기본값)
  studentInfo: (isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.studentInfo(getViewerScope(isLoggedIn)),
      queryFn: () => getStudentInfo(),
      enabled: isLoggedIn,
    }),
  // KOIN_ORDER_WEBVIEW pages/Delivery/hooks/useGetRiderRequest 이전(배달기사님 요청 문구)
  riderMessages: (isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.riderMessages(getViewerScope(isLoggedIn)),
      queryFn: () => getRiderMessages(),
      enabled: isLoggedIn,
    }),
  // KOIN_ORDER_WEBVIEW pages/Payment/hooks/useDeliveryInfo 이전(교내·교외 배달 가능 여부)
  shopDeliveryInfo: (orderableShopId: number) =>
    queryOptions({
      queryKey: orderQueryKeys.shopDeliveryInfo(orderableShopId),
      queryFn: () => getShopDeliveryInfo(orderableShopId),
      enabled: orderableShopId > 0,
    }),
  // KOIN_ORDER_WEBVIEW pages/OrderFinish/hooks/usePaymentInfo 이전(주문 결과)
  paymentInfo: (paymentId: number, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.paymentInfo(paymentId, getViewerScope(isLoggedIn)),
      queryFn: () => getPaymentInfo(paymentId),
      enabled: isLoggedIn,
    }),
  // KOIN_ORDER_WEBVIEW pages/OrderList/hooks/useOrderHistory 이전(지난 주문 무한 스크롤)
  orderHistory: (filter: OrderHistoryFilter, isLoggedIn: boolean) =>
    infiniteQueryOptions({
      queryKey: orderQueryKeys.orderHistory(filter, getViewerScope(isLoggedIn)),
      queryFn: ({ pageParam }) => getOrderHistory({ page: pageParam, ...filter }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.current_page < lastPage.total_page ? lastPage.current_page + 1 : undefined,
      enabled: isLoggedIn,
    }),
  // KOIN_ORDER_WEBVIEW pages/OrderList/hooks/useInProgressOrder 이전(준비 중 주문)
  inProgressOrders: (isLoggedIn: boolean) =>
    queryOptions({
      queryKey: orderQueryKeys.inProgressOrders(getViewerScope(isLoggedIn)),
      queryFn: () => getInProgressOrders(),
      enabled: isLoggedIn,
    }),
  // KOIN_ORDER_WEBVIEW pages/Home/hooks/useOrderableShops 이전(주문 홈 상점 목록)
  orderableShops: (params: OrderableShopsParams) =>
    queryOptions({
      queryKey: orderQueryKeys.orderableShops(params),
      queryFn: () => getOrderableShops(params),
    }),
};
