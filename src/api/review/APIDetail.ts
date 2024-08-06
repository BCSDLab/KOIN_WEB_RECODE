import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { ReviewRequest, UploadImage } from './entity';

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
  method = HTTP_METHOD.POST;

  response!: R;

  path: string;

  auth = true;

  data: ReviewRequest;

  constructor(public authorization: string, shopId: string, reviewId: string, data: ReviewRequest) {
    this.path = `shops/${shopId}/reviews/${reviewId}`;
    this.data = data;
  }
}

export class UploadFile<R extends UploadImage> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  response!: R;

  path = 'SHOPS/upload/file';

  auth = true;

  data: FormData;

  constructor(public authorization: string, formData: FormData) {
    this.data = formData;
  }
}
