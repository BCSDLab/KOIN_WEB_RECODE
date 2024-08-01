import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { ReviewRequest, UploadImage } from './entity';

export class StoreReview<R extends ReviewRequest> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  response!: R;

  path: string;

  data: ReviewRequest;

  constructor(id: string, data: ReviewRequest) {
    this.path = `shops/${id}/reviews`;
    this.data = data;
  }
}

export class UploadFile<R extends UploadImage> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  response!: R;

  path = 'SHOPS/upload/file';

  data: FormData;

  constructor(formData: FormData) {
    this.data = formData;
  }
}
