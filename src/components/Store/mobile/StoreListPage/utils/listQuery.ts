import type { ParsedUrlQuery } from 'querystring';

// KOIN_ORDER_WEBVIEW pages/NearbyShops 쿼리 파라미터(category·sort·filter) 해석. 서버(getServerSideProps)와 화면이 같이 쓴다
export type SortType = 'NONE' | 'COUNT' | 'COUNT_ASC' | 'COUNT_DESC' | 'RATING' | 'RATING_ASC' | 'RATING_DESC';
export type ListFilter = 'OPEN' | null;

const SORT_VALID: SortType[] = ['NONE', 'COUNT', 'COUNT_ASC', 'COUNT_DESC', 'RATING', 'RATING_ASC', 'RATING_DESC'];

export const SORT_TRACKING_MAP: Record<SortType, string> = {
  NONE: 'check_default',
  COUNT: 'check_review',
  COUNT_ASC: 'check_review',
  COUNT_DESC: 'check_review',
  RATING: 'check_star',
  RATING_ASC: 'check_star',
  RATING_DESC: 'check_star',
};

export const SORT_OPTIONS: Array<{ id: SortType; label: string }> = [
  { id: 'RATING_DESC', label: '별점 높은 순' },
  { id: 'COUNT_DESC', label: '리뷰순' },
  { id: 'NONE', label: '기본순' },
];

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

export function parseCategory(query: string | null) {
  const categoryNumber = Number(query);

  return Number.isNaN(categoryNumber) || categoryNumber <= 0 ? 1 : categoryNumber;
}

export function parseSort(query: string | null): SortType {
  return SORT_VALID.includes(query as SortType) ? (query as SortType) : 'NONE';
}

export function parseFilter(query: string | null): ListFilter {
  return query === 'OPEN' ? 'OPEN' : null;
}

export function parseListQuery(query: ParsedUrlQuery) {
  return {
    category: parseCategory(first(query.category)),
    sort: parseSort(first(query.sort)),
    filter: parseFilter(first(query.filter)),
  };
}

// 목록 API(v3/shops) 인자. 기본순·필터 없음은 파라미터를 보내지 않는다
export function getListRequestParams(sort: SortType, filter: ListFilter) {
  return {
    sorter: sort !== 'NONE' ? sort : undefined,
    filter: filter === 'OPEN' ? filter : undefined,
  };
}
