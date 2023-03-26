import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { LandListResponse, LandDetailResponse } from './entity';

export class LandList<R extends LandListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/lands';

  response!: R;
}

export class LandDetailInfo<R extends LandDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path: string;

  constructor(id: string | undefined) {
    this.path = `lands/${id}`;
  }
}
