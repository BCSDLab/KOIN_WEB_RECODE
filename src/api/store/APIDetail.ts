import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  StoreListResponse,
  StoreDetailResponse,
  StoreDetailMenuResponse,
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

  constructor(id: any) {
    this.path = `shops/${id}`;
  }
}

export class StoreDetailMenu<R extends StoreDetailMenuResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'shops/:id/menus';

  constructor(id: any) {
    this.path = `shops/${id}/menus`;
  }
}
