import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type {
  BannerCategoriesResponse,
  BannersResponse,
} from './entity';

const PLATFORM = 'WEB';

export class BannerCategoryList<R extends BannerCategoriesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/banner-categories';

  response!: R;

  auth = false;
}

export class Banners<R extends BannersResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(public categoryId: number) {
    this.path = `/banners/${categoryId}?platform=${PLATFORM}`;
  }
}
