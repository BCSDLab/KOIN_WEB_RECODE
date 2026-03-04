import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { CallvanListRequest, CallvanListResponse } from './entity';

export class GetCallvanList<R extends CallvanListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/callvan';

  params: CallvanListRequest;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    params: CallvanListRequest,
  ) {
    this.params = params;
  }
}
