import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type {
  ClubCategoriesResponse,
  ClubListResponse,
  HotClubsResponse,
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
    + `${categoryId !== undefined ? `?categoryId=${categoryId}` : ''}`
    + `${hitSort !== undefined ? `${categoryId !== undefined ? '&' : '?'}hitSort=${hitSort}` : ''}`;
  }
}

export class HotClubs<R extends HotClubsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/hot';

  response!: R;

  auth = false;
}
