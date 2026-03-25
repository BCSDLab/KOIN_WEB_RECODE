import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { StoreFilterType, StoreSorterType } from './entity';
import {
  getAllEvent,
  getMyReview,
  getRelateSearch,
  getReviewList,
  getStoreBenefitCategory,
  getStoreBenefitList,
  getStoreCategories,
  getStoreDetailInfo,
  getStoreDetailMenu,
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
  listV2: ({ sorter, filter, query }: StoreListQueryParams) =>
    [...storeQueryKeys.all, 'list-v2', { sorter, filter, query: query ?? '' }] as const,
  allEvents: () => [...storeQueryKeys.all, 'all-events'] as const,
  detail: (id: string) => [...storeQueryKeys.all, 'detail', id] as const,
  detailMenu: (id: string) => [...storeQueryKeys.all, 'detail-menu', id] as const,
  detailPage: (id: string) => [...storeQueryKeys.all, 'detail-page', id] as const,
  eventList: (id: string) => [...storeQueryKeys.all, 'event-list', id] as const,
  benefitCategory: () => [...storeQueryKeys.all, 'benefit-category'] as const,
  benefitList: (id: string) => [...storeQueryKeys.all, 'benefit-list', id] as const,
  relatedSearch: (query: string) => [...storeQueryKeys.all, 'related-search', query] as const,
  reviews: (shopId: number) => ['review', shopId] as const,
  reviewFeed: (shopId: number, sorter: string) => [...storeQueryKeys.reviews(shopId), sorter] as const,
  reviewList: ({ shopId, page, sorter }: Omit<StoreReviewListQueryParams, 'token'>) =>
    [...storeQueryKeys.reviewFeed(shopId, sorter), page] as const,
  myReviews: (shopId: string) => ['review', 'my-review', shopId] as const,
  myReview: (shopId: string, sorter: string) => [...storeQueryKeys.myReviews(shopId), sorter] as const,
};

export const storeQueries = {
  categories: () =>
    queryOptions({
      queryKey: storeQueryKeys.categories(),
      queryFn: getStoreCategories,
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
      queryKey: storeQueryKeys.reviewList({ shopId, page, sorter }),
      queryFn: () => getReviewList(shopId, page, sorter, token),
    }),

  reviewFeed: ({ shopId, sorter, token }: Omit<StoreReviewListQueryParams, 'page'>) =>
    infiniteQueryOptions({
      queryKey: storeQueryKeys.reviewFeed(shopId, sorter),
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
    queryOptions({
      queryKey: storeQueryKeys.myReview(shopId, sorter),
      queryFn: () => getMyReview(shopId, sorter, token),
    }),
};
