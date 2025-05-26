import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { UploadImage } from './entity';

export class BaseUploadFile<R extends UploadImage> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  response!: R;

  auth = true;

  data: FormData;

  constructor(
    public authorization: string,
    formData: FormData,
    public path: string,
  ) {
    this.data = formData;
  }
}

export class ShopUploadFile<R extends UploadImage> extends BaseUploadFile<R> {
  constructor(authorization: string, formData: FormData) {
    super(authorization, formData, 'SHOPS/upload/file');
  }
}

export class LostItemUploadFile<R extends UploadImage> extends BaseUploadFile<R> {
  constructor(authorization: string, formData: FormData) {
    super(authorization, formData, 'LOST_ITEMS/upload/file');
  }
}

export class ClubUploadFile<R extends UploadImage> extends BaseUploadFile<R> {
  constructor(authorization: string, formData: FormData) {
    super(authorization, formData, 'CLUB/upload/file');
  }
}
