import type { OrderableShopsFilter, OrderableShopsParams, OrderableShopsSorter } from 'api/order/entity';

// KOIN_ORDER_WEBVIEW pages/Home 이전. 정렬·필터·최소주문금액 선택지는 order와 같다
export type OrderHomeSort = OrderableShopsSorter | 'NONE';

export const SORT_OPTIONS: Array<{ id: OrderHomeSort; label: string }> = [
  { id: 'RATING_DESC', label: '별점 높은 순' },
  { id: 'COUNT_DESC', label: '리뷰순' },
  { id: 'NONE', label: '기본순' },
];

export const MIN_ORDER_ALL_VALUE = 99999;

export const MIN_ORDER_OPTIONS = [
  { value: 0, label: '0' },
  { value: 5000, label: '5,000' },
  { value: 10000, label: '10,000' },
  { value: 15000, label: '15,000' },
  { value: 20000, label: '20,000' },
  { value: MIN_ORDER_ALL_VALUE, label: '전체' },
];

export interface OrderHomeConditions {
  category: number;
  filters: OrderableShopsFilter[];
  sort: OrderHomeSort;
  minOrderAmount: number | null;
}

// order 기본 진입: 전체보기 + 영업중
export const DEFAULT_ORDER_HOME_CONDITIONS: OrderHomeConditions = {
  category: 1,
  filters: ['IS_OPEN'],
  sort: 'NONE',
  minOrderAmount: null,
};

export function isMinOrderSelected(minOrderAmount: number | null): minOrderAmount is number {
  return minOrderAmount !== null && minOrderAmount !== MIN_ORDER_ALL_VALUE;
}

// order useOrderableShops에 넘기는 값과 같은 요청을 만든다. 서버 프리페치와 화면 초기 상태가 같은 키를 쓰도록 한 곳에서 만든다
export function getOrderableShopsParams({
  category,
  filters,
  sort,
  minOrderAmount,
}: OrderHomeConditions): OrderableShopsParams {
  const params: OrderableShopsParams = { category_filter: category };
  if (filters.length > 0) params.filter = filters;
  if (isMinOrderSelected(minOrderAmount)) params.minimum_order_amount = minOrderAmount;
  if (sort !== 'NONE') params.sorter = sort;

  return params;
}
