import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type {
  ClubCategoriesResponse,
  ClubDetailResponse,
  ClubInroductionData,
  ClubListResponse,
  ClubNewQnA,
  ClubQnAData,
  DeleteClubLikeResonse,
  DeleteClubQnAResponse,
  HotClubResponse,
  NewClubData,
  NewClubManager,
  NewClubManagerResponse,
  PostClubQnAResponse,
  PostClubResponse,
  PutClubLikeResonse,
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

export class PostClub<R extends PostClubResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(public authorization: string, public data: NewClubData) { }
}

export class ClubDetail<R extends ClubDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(public authorization: string, public clubId: number) {
    this.path = `/clubs/${clubId}`;
  }
}

export class PutClubInroduction<R extends ClubDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/clubs';

  response!:R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
    public data: ClubInroductionData,
  ) {
    this.path = `/clubs/${clubId}/introduction`;
  }
}

export class PutClubLike<R extends PutClubLikeResonse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/clubs';

  response!:R;

  auth = true;

  constructor(public authorization: string, public clubId: number | string) {
    this.path = `/clubs/${clubId}/like`;
  }
}

export class DeleteClubLike<R extends DeleteClubLikeResonse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/clubs';

  response!:R;

  auth = true;

  constructor(public authorization: string, public clubId: number | string) {
    this.path = `/clubs/${clubId}/like/cancel`;
  }
}

export class PostClubQnA<R extends PostClubQnAResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/clubs';

  response!:R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
    public data: ClubNewQnA,
  ) {
    this.path = `/clubs/${clubId}/qna`;
  }
}

export class GetClubQnA<R extends ClubQnAData> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!:R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
  ) {
    this.path = `/clubs/${clubId}/qna`;
  }
}

export class DeleteClubQnA<R extends DeleteClubQnAResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/clubs';

  response!:R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
    public qnaId: number | string,
  ) {
    this.path = `/clubs/${clubId}/qna/${qnaId}`;
  }
}

export class PutClub<R extends PostClubResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public data: NewClubData,
    public clubId: number | string,
  ) {
    this.path = `/clubs/${clubId}`;
  }
}

export class PutNewClubManager<R extends NewClubManagerResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/clubs/empowerment';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public data: NewClubManager,
  ) {
  }
}
