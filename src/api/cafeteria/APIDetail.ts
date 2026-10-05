import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type { APIResponse } from 'interfaces/APIResponse';

import type { DiningResponseType } from './entity';

export class DiningLikePatcher<R extends APIResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PATCH;

  path = '/dining/like';

  response!: R;

  params: {
    diningId: number;
  };

  auth = true;

  constructor(diningId: number) {
    this.params = {
      diningId,
    };
  }
}

export class CancelDiningLikePatcher<R extends APIResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PATCH;

  path = '/dining/like/cancel';

  response!: R;

  params: {
    diningId: number;
  };

  auth = true;

  constructor(diningId: number) {
    this.params = {
      diningId,
    };
  }
}

export default class DiningResponse<R extends DiningResponseType> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/dinings';

  response!: R;

  params: Record<string, string>;

  auth = false;

  constructor(date: string) {
    this.params = {
      date,
    };
  }
}
