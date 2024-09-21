import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { DeleteResponse } from 'api/auth/entity';
import {
  StoreListResponse,
  StoreListV2Response,
  StoreDetailResponse,
  StoreDetailMenuResponse,
  StoreCategoriesResponse,
  AllStoreEventResponse,
  StoreEventListResponse,
  ReviewListResponse,
  ReviewReportResponse,
  ReviewReportRequest,
  StoreSorterType,
  StoreFilterType,
  MyReviewResponse,
} from './entity';

export class StoreList<R extends StoreListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops';

  response!: R;
}

export class StoreListV2<R extends StoreListV2Response> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'v2/shops';

  response!: R;

  params: {
    sorter?: StoreSorterType,
    filter?: StoreFilterType[],
  };

  constructor(sorter: StoreSorterType, filter: StoreFilterType[]) {
    this.params = {
      sorter,
      filter,
    };
  }
}
export class StoreDetailInfo<R extends StoreDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'shops/:id';

  constructor(id: string) {
    this.path = `shops/${id}`;
  }
}

export class StoreDetailMenu<R extends StoreDetailMenuResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'shops/:id/menus';

  constructor(id: string) {
    this.path = `shops/${id}/menus`;
  }
}

export class StoreBenefitList<R extends StoreListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'benefit/:id/shops';

  constructor(id: string) {
    this.path = `benefit/${id}/shops`;
  }
}

export class StoreCategories<R extends StoreCategoriesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'shops/categories';

  constructor() {
    this.path = 'shops/categories';
  }
}

export class AllStoreEvent<R extends AllStoreEventResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'shops/events';

  constructor() {
    this.path = 'shops/events';
  }
}

export class StoreEventList<R extends StoreEventListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'shops/:id/events';

  constructor(id:string) {
    this.path = `shops/${id}/events`;
  }
}

export class ReviewList<R extends ReviewListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'shops/:id/reviews';

  response!: R;

  constructor(id: number, pageParam: number, sorter: string, public authorization?: string) {
    this.path = `shops/${id}/reviews?page=${pageParam}&limit=10&sorter=${sorter}`;
  }
}

export class DeleteReview<R extends DeleteResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = 'shops/:shopId/reviews/:reviewId';

  response!: R;

  constructor(reviewId: number, shopId: string, public authorization: string) {
    this.path = `shops/${shopId}/reviews/${reviewId}`;
  }
}

export class GetMyReviews<R extends MyReviewResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'shops/:shopId/reviews/me';

  response!: R;

  constructor(shopId: string, sorter: string, public authorization: string) {
    this.path = `shops/${shopId}/reviews/me?sorter=${sorter}`;
  }
}

export class ReviewReport<R extends ReviewReportResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/shops/:shopId/reviews/:reviewId/reports';

  response!: R;

  data: ReviewReportRequest;

  constructor(
    shop_id: number,
    review_id: number,
    data: ReviewReportRequest,
    public authorization?: string,
  ) {
    this.path = `/shops/${shop_id}/reviews/${review_id}/reports`;
    this.data = data;
  }
}
