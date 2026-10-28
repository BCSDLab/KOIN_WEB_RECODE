import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import type {
  NearbyStoresRelateSearchResponse,
  ReviewDetailResponse,
  ReviewReportCategoriesResponse,
  ReviewSorter,
  ShopDetailInfoResponse,
  ShopInfoResponse,
  ShopInfoSummaryResponse,
  ShopListResponse,
  ShopMenuGroupsResponse,
  UnorderableShopDetailInfoResponse,
  UnorderableShopMenusResponse,
  UnorderableShopReviewsResponse,
} from './entity';

// 모바일 상점·주문 화면이 부르는 엔드포인트. KOIN_ORDER_WEBVIEW와 같은 엔드포인트를 쓰므로 경로·파라미터를 바꿀 때 양쪽을 함께 맞춘다.
// 데스크톱과 요청·응답이 같은 카테고리·이벤트는 api/store 클래스를 쓴다(index.ts)

export class ShopListV3<R extends ShopListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v3/shops';

  response!: R;

  params: { sorter?: string; filter?: string };

  // qsStringify는 undefined를 "undefined" 문자열로 보내므로 값이 있는 키만 담는다
  constructor(sorter?: string, filter?: string) {
    this.params = {
      ...(sorter !== undefined && { sorter }),
      ...(filter !== undefined && { filter }),
    };
  }
}

export class ShopRelatedSearch<R extends NearbyStoresRelateSearchResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'v2/shops/search/related';

  response!: R;

  params: { keyword: string };

  constructor(keyword: string) {
    this.params = { keyword };
  }
}

export class ShopSummary<R extends ShopInfoSummaryResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'shops/:id/summary';

  response!: R;

  constructor(id: string) {
    this.path = `shops/${id}/summary`;
  }
}

export class ShopDetailV2<R extends UnorderableShopDetailInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'v2/shops/:id';

  response!: R;

  constructor(id: string) {
    this.path = `v2/shops/${id}`;
  }
}

export class ShopMenus<R extends UnorderableShopMenusResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'shops/:id/menus';

  response!: R;

  constructor(id: string) {
    this.path = `shops/${id}/menus`;
  }
}

export class ShopReviews<R extends UnorderableShopReviewsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops/:id/reviews';

  response!: R;

  params: { page: number; limit: number; sorter: ReviewSorter };

  constructor(id: string, page: number, limit: number, sorter: ReviewSorter) {
    this.path = `/shops/${id}/reviews`;
    this.params = { page, limit, sorter };
  }
}

export class ShopReviewReportCategories<R extends ReviewReportCategoriesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops/reviews/reports/categories';

  response!: R;
}

export class ShopReviewDetail<R extends ReviewDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops/:id/reviews/:reviewId';

  response!: R;

  constructor(id: string, reviewId: string) {
    this.path = `/shops/${id}/reviews/${reviewId}`;
  }
}

export class OrderShopSummary<R extends ShopInfoSummaryResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'order/shop/:id/summary';

  response!: R;

  constructor(id: string) {
    this.path = `order/shop/${id}/summary`;
  }
}

export class OrderShopMenuGroups<R extends ShopMenuGroupsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'order/shop/:id/menus/groups';

  response!: R;

  constructor(id: string) {
    this.path = `order/shop/${id}/menus/groups`;
  }
}

export class OrderShopMenus<R extends ShopInfoResponse[]> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'order/shop/:id/menus';

  response!: R;

  constructor(id: string) {
    this.path = `order/shop/${id}/menus`;
  }
}

export class OrderShopDetail<R extends ShopDetailInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'order/shop/:id/detail';

  response!: R;

  constructor(id: string) {
    this.path = `order/shop/${id}/detail`;
  }
}
