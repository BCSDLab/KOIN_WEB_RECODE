import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
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

  constructor(id: string) {
    this.path = `lands/${id}`;
  }
}
