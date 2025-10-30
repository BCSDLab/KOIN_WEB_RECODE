import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { APIResponse } from 'interfaces/APIResponse';
import { DiningResponseType } from './entity';

export class DiningLikePatcher<R extends APIResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PATCH;

  path = '/dining/like';

  response!: R;

  params: {
    diningId: number;
  };

  auth = true;

  constructor(
    diningId: number,
    public authorization: string,
  ) {
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

  constructor(
    diningId: number,
    public authorization: string,
  ) {
    this.params = {
      diningId,
    };
  }
}

export default class DiningResponse<R extends DiningResponseType> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/dinings';

  response!: R;

  params: {
    [index: string]: string;
  };

  auth = false;

  constructor(
    date: string,
    public authorization?: string,
  ) {
    this.params = {
      date,
    };
  }
}
