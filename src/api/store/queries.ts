import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getViewerScope, type ViewerScope } from 'utils/ts/getViewerScope';

import type { StoreFilterType, StoreSorterType } from './entity';
import {
  getAllEvent,
  getMyReview,
  getRelateSearch,
  getReviewList,
  getStoreBenefitCategory,
  getStoreBenefitList,
  getStoreCategories,
  getStoreCounts,
  getStoreDetailInfo,
  getStoreDetailMenu,
  getStoreEventCount,
  getStoreEventList,
  getStoreListV2,
} from './index';

interface StoreListQueryParams {
  sorter: StoreSorterType;
  filter: StoreFilterType[];
  query?: string;
}

interface StoreReviewListQueryParams {
  shopId: number;
  page: number;
  sorter: string;
  token?: string;
}

export const storeQueryKeys = {
  all: ['store'] as const,
  categories: () => [...storeQueryKeys.all, 'categories'] as const,
  counts: () => [...storeQueryKeys.all, 'counts'] as const,
  eventCount: () => [...storeQueryKeys.all, 'event-count'] as const,
  listV2: ({ sorter, filter, query }: StoreListQueryParams) =>
    [...storeQueryKeys.all, 'list-v2', { sorter, filter, query: query ?? '' }] as const,
  allEvents: () => [...storeQueryKeys.all, 'all-events'] as const,
  detail: (id: string) => [...storeQueryKeys.all, 'detail', id] as const,
  detailMenu: (id: string) => [...storeQueryKeys.all, 'detail-menu', id] as const,
  detailPage: (id: string, token?: string | null) =>
    [...storeQueryKeys.all, 'detail-page', id, getViewerScope(token)] as const,
  eventList: (id: string) => [...storeQueryKeys.all, 'event-list', id] as const,
  benefitCategory: () => [...storeQueryKeys.all, 'benefit-category'] as const,
  benefitList: (id: string) => [...storeQueryKeys.all, 'benefit-list', id] as const,
  relatedSearch: (query: string) => [...storeQueryKeys.all, 'related-search', query] as const,
  reviews: (shopId: number, viewerScope: ViewerScope) => ['review', viewerScope, shopId] as const,
  reviewFeed: (shopId: number, sorter: string, viewerScope: ViewerScope) =>
    [...storeQueryKeys.reviews(shopId, viewerScope), sorter] as const,
  reviewList: ({ shopId, page, sorter, token }: StoreReviewListQueryParams) =>
    [...storeQueryKeys.reviewFeed(shopId, sorter, getViewerScope(token)), page] as const,
  myReviews: (shopId: string) => ['review', 'auth', 'my-review', shopId] as const,
  myReview: (shopId: string, sorter: string) => [...storeQueryKeys.myReviews(shopId), sorter] as const,
};

export const storeQueries = {
  categories: () =>
    queryOptions({
      queryKey: storeQueryKeys.categories(),
      queryFn: getStoreCategories,
    }),

  counts: () =>
    queryOptions({
      queryKey: storeQueryKeys.counts(),
      queryFn: getStoreCounts,
    }),

  eventCount: () =>
    queryOptions({
      queryKey: storeQueryKeys.eventCount(),
      queryFn: getStoreEventCount,
    }),

  listV2: ({ sorter, filter, query }: StoreListQueryParams) =>
    queryOptions({
      queryKey: storeQueryKeys.listV2({ sorter, filter, query }),
      queryFn: () => getStoreListV2(sorter, filter, query),
    }),

  allEvents: () =>
    queryOptions({
      queryKey: storeQueryKeys.allEvents(),
      queryFn: getAllEvent,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: storeQueryKeys.detail(id),
      queryFn: () => getStoreDetailInfo(id),
    }),

  detailMenu: (id: string) =>
    queryOptions({
      queryKey: storeQueryKeys.detailMenu(id),
      queryFn: () => getStoreDetailMenu(id),
    }),

  eventList: (id: string) =>
    queryOptions({
      queryKey: storeQueryKeys.eventList(id),
      queryFn: () => getStoreEventList(id),
    }),

  benefitCategory: () =>
    queryOptions({
      queryKey: storeQueryKeys.benefitCategory(),
      queryFn: getStoreBenefitCategory,
    }),

  benefitList: (id: string) =>
    queryOptions({
      queryKey: storeQueryKeys.benefitList(id),
      queryFn: () => getStoreBenefitList(id),
    }),

  relatedSearch: (query: string) =>
    queryOptions({
      queryKey: storeQueryKeys.relatedSearch(query),
      queryFn: () => getRelateSearch(query),
    }),

  reviewList: ({ shopId, page, sorter, token }: StoreReviewListQueryParams) =>
    queryOptions({
      queryKey: storeQueryKeys.reviewList({ shopId, page, sorter, token }),
      queryFn: () => getReviewList(shopId, page, sorter, token),
    }),

  reviewFeed: ({ shopId, sorter, token }: Omit<StoreReviewListQueryParams, 'page'>) =>
    infiniteQueryOptions({
      queryKey: storeQueryKeys.reviewFeed(shopId, sorter, getViewerScope(token)),
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getReviewList(shopId, pageParam, sorter, token),
      getNextPageParam: (lastPage) => {
        if (lastPage.total_page > lastPage.current_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  myReview: (shopId: string, sorter: string, token: string) =>
    // 로그인한 본인 리뷰만 응답하는 엔드포인트라 토큰 값 자체는 결과 모양에 영향을 주지 않는다.
    // 사용자 전환은 principal 전환 시점의 queryClient.clear()로 별도 처리한다.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- token은 결과 모양에 영향을 주지 않는다
    queryOptions({
      queryKey: storeQueryKeys.myReview(shopId, sorter),
      queryFn: () => getMyReview(shopId, sorter, token),
    }),
};
