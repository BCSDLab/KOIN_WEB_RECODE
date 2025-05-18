import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type { HotClubsResponse } from './entity';

export class HotClubs<R extends HotClubsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/hot';

  response!: R;

  auth = false;
}
