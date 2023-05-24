import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { StoreListResponse, StoreDetailResponse } from './entity';

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
