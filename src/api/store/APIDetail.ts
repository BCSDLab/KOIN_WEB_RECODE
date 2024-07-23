import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  StoreListResponse,
  StoreDetailResponse,
  StoreDetailMenuResponse,
  StoreCategoriesResponse,
  AllStoreEventResponse,
  StoreEventListResponse,
  ReviewListResponse,
} from './entity';

export class StoreList<R extends StoreListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops';

  response!: R;
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

  constructor(id: number, pageParam: number) {
    this.path = `shops/${id}/reviews?page=${pageParam}&limit=10`;
  }
}
