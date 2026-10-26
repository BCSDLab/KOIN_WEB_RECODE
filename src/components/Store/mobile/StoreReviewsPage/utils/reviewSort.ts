import type { ReviewSorter } from 'api/storeMobile/entity';

// KOIN_ORDER_WEBVIEW shopReview·SortModal의 정렬 옵션
export const REVIEW_SORT_OPTIONS: Array<{ id: ReviewSorter; label: string }> = [
  { id: 'LATEST', label: '최신순' },
  { id: 'OLDEST', label: '오래된순' },
  { id: 'HIGHEST_RATING', label: '평점 높은순' },
  { id: 'LOWEST_RATING', label: '평점 낮은순' },
];

// ?sort 쿼리를 정렬 값으로 바꾼다. 알 수 없는 값은 order와 같게 최신순
export const parseReviewSort = (raw: string | string[] | undefined): ReviewSorter => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const matched = REVIEW_SORT_OPTIONS.find((option) => option.id === value);

  return matched ? matched.id : 'LATEST';
};

export const getReviewSortLabel = (sort: ReviewSorter) =>
  REVIEW_SORT_OPTIONS.find((option) => option.id === sort)?.label ?? '최신순';
