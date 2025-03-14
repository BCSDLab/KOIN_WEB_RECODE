import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { ReviewRequest, ReviewResponse } from './entity';

export class GetStoreReview<R extends ReviewResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path: string;

  auth = true;

  constructor(public authorization: string, shopId: string, reviewId: string) {
    this.path = `shops/${shopId}/reviews/${reviewId}`;
  }
}

export class AddStoreReview<R extends ReviewRequest> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  response!: R;

  path: string;

  auth = true;

  data: ReviewRequest;

  constructor(public authorization: string, id: string, data: ReviewRequest) {
    this.path = `shops/${id}/reviews`;
    this.data = data;
  }
}

export class EditStoreReview<R extends ReviewRequest> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  response!: R;

  path: string;

  auth = true;

  data: ReviewRequest;

  constructor(public authorization: string, shopId: string, reviewId: string, data: ReviewRequest) {
    this.path = `shops/${shopId}/reviews/${reviewId}`;
    this.data = data;
  }
}
