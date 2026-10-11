import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { ReviewSorter } from './entity';
import {
  getOrderShopDetail,
  getOrderShopMenuGroups,
  getOrderShopMenus,
  getOrderShopSummary,
  getShopCategories,
  getShopDetailV2,
  getShopEvents,
  getShopListV3,
  getShopMenus,
  getShopRelatedSearch,
  getShopReviewDetail,
  getShopReviewReportCategories,
  getShopReviews,
  getShopSummary,
} from './index';


// 모바일 상점·주문 화면 쿼리. 데스크톱 상점(api/store)과 캐시를 섞지 않도록 키 접두사를 분리한다.
// 리뷰처럼 로그인 여부에 따라 응답이 달라지는 쿼리는 getViewerScope로 범위를 키에 넣는다(SSR·클라이언트 키 일치)
export const storeMobileQueryKeys = {
  all: ['store-mobile'] as const,
  categories: () => [...storeMobileQueryKeys.all, 'categories'] as const,
  list: (sorter?: string, filter?: string) =>
    [...storeMobileQueryKeys.all, 'list', sorter ?? '', filter ?? ''] as const,
  relatedSearch: (keyword: string) => [...storeMobileQueryKeys.all, 'related-search', keyword] as const,
  summary: (id: string) => [...storeMobileQueryKeys.all, 'summary', id] as const,
  detail: (id: string) => [...storeMobileQueryKeys.all, 'detail', id] as const,
  menus: (id: string) => [...storeMobileQueryKeys.all, 'menus', id] as const,
  events: (id: string) => [...storeMobileQueryKeys.all, 'events', id] as const,
  reviews: (id: string, scope: 'auth' | 'guest') => [...storeMobileQueryKeys.all, 'reviews', scope, id] as const,
  reviewList: (id: string, sorter: ReviewSorter, scope: 'auth' | 'guest') =>
    [...storeMobileQueryKeys.reviews(id, scope), sorter] as const,
  reviewDetail: (id: string, reviewId: string) => [...storeMobileQueryKeys.all, 'review-detail', id, reviewId] as const,
  reportCategories: () => [...storeMobileQueryKeys.all, 'report-categories'] as const,
  orderSummary: (id: string) => [...storeMobileQueryKeys.all, 'order', 'summary', id] as const,
  orderMenuGroups: (id: string) => [...storeMobileQueryKeys.all, 'order', 'menu-groups', id] as const,
  orderMenus: (id: string) => [...storeMobileQueryKeys.all, 'order', 'menus', id] as const,
  orderDetail: (id: string) => [...storeMobileQueryKeys.all, 'order', 'detail', id] as const,
};

// order는 리뷰 목록을 page=1, limit=50 한 번으로 받는다
const REVIEW_PAGE_LIMIT = 50;

export const storeMobileQueries = {
  categories: () => queryOptions({ queryKey: storeMobileQueryKeys.categories(), queryFn: getShopCategories }),
  list: (sorter?: string, filter?: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.list(sorter, filter), queryFn: () => getShopListV3(sorter, filter) }),
  relatedSearch: (keyword: string) =>
    queryOptions({
      queryKey: storeMobileQueryKeys.relatedSearch(keyword),
      queryFn: () => getShopRelatedSearch(keyword),
      enabled: keyword.length > 0,
    }),
  summary: (id: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.summary(id), queryFn: () => getShopSummary(id) }),
  detail: (id: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.detail(id), queryFn: () => getShopDetailV2(id) }),
  menus: (id: string) => queryOptions({ queryKey: storeMobileQueryKeys.menus(id), queryFn: () => getShopMenus(id) }),
  events: (id: string) => queryOptions({ queryKey: storeMobileQueryKeys.events(id), queryFn: () => getShopEvents(id) }),
  reviewList: (id: string, sorter: ReviewSorter, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: storeMobileQueryKeys.reviewList(id, sorter, getViewerScope(isLoggedIn)),
      queryFn: () => getShopReviews(id, 1, REVIEW_PAGE_LIMIT, sorter),
    }),
  reviewDetail: (id: string, reviewId: string) =>
    queryOptions({
      queryKey: storeMobileQueryKeys.reviewDetail(id, reviewId),
      queryFn: () => getShopReviewDetail(id, reviewId),
    }),
  reportCategories: () =>
    queryOptions({ queryKey: storeMobileQueryKeys.reportCategories(), queryFn: getShopReviewReportCategories }),
  orderSummary: (id: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.orderSummary(id), queryFn: () => getOrderShopSummary(id) }),
  orderMenuGroups: (id: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.orderMenuGroups(id), queryFn: () => getOrderShopMenuGroups(id) }),
  orderMenus: (id: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.orderMenus(id), queryFn: () => getOrderShopMenus(id) }),
  orderDetail: (id: string) =>
    queryOptions({ queryKey: storeMobileQueryKeys.orderDetail(id), queryFn: () => getOrderShopDetail(id) }),
};
