import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { StoreListResponse, StoreDetailResponse } from './entity';

export class StoreList<R extends StoreListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops';

  response!: R;
}

export class StoreDetailInfo<R extends StoreDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/shops/:id';

  response!: R;
}
