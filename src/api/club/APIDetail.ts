import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type {
  ClubCategoriesResponse,
  ClubListResponse,
  HotClubResponse,
  AddClubLikeResponse,
  CancelClubLikeResponse,
} from './entity';

export class ClubCategories<R extends ClubCategoriesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/categories';

  response!: R;

  constructor(public authorization?: string) { }
}

export class ClubList<R extends ClubListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  constructor(public authorization?: string, public categoryId?: number, public hitSort?: string) {
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

export class AddClubLike<R extends AddClubLikeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, public clubId: number) {
    this.path = `/clubs/${clubId}/like`;
  }
}

export class CancelClubLike<R extends CancelClubLikeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, public clubId: number) {
    this.path = `/clubs/${clubId}/like/cancel`;
  }
}
