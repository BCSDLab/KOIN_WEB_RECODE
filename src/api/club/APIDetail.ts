import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type {
  ClubCategoriesResponse,
  ClubListResponse,
  HotClubResponse,
  NewClubData,
  PostClubResponse,
} from './entity';

export class ClubCategories<R extends ClubCategoriesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/categories';

  response!: R;

  auth = false;
}

export class ClubList<R extends ClubListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  auth = false;

  constructor(public categoryId?: number, public hitSort?: boolean) {
    this.path = '/clubs'
    + `${(categoryId && `?categoryId=${categoryId}`) || ''}`
    + `${(hitSort && `${categoryId ? '&' : '?'}hitSort=${hitSort}`) || ''}`;
  }
}

export class HotClub<R extends HotClubResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/hot';

  response!: R;

  auth = false;
}

export class PostClub<R extends PostClubResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(public authorization: string, public data: NewClubData) { }
}
