import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type {
  ClubCategoriesResponse,
  ClubDetailResponse,
  ClubEventListResponse,
  ClubEventRequest,
  ClubEventResponse,
  ClubIntroductionData,
  ClubListResponse,
  ClubNewQnA,
  ClubQnAData,
  ClubRecruitmentRequest,
  ClubRecruitmentResponse,
  ClubSearchResponse,
  DeleteClubLikeResponse,
  DeleteClubQnAResponse,
  HotClubResponse,
  NewClubData,
  NewClubManager,
  NewClubManagerResponse,
  PostClubQnAResponse,
  PostClubResponse,
  PutClubLikeResponse,
} from './entity';

export class ClubCategories<R extends ClubCategoriesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/categories';

  response!: R;

  constructor(public authorization?: string) {}
}

export class ClubList<R extends ClubListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  params: {
    categoryId?: number;
    sortType?: string;
    isRecruiting: boolean;
    query?: string;
  };

  constructor(
    public authorization?: string,
    public categoryId?: number,
    public sortType?: string,
    public isRecruiting?: boolean,
    public query?: string,
  ) {
    this.params = {
      ...(categoryId && { categoryId }),
      ...(sortType && { sortType }),
      isRecruiting: !!isRecruiting,
      ...(query && { query }),
    };
  }
}

export class GetRelatedSearchClub<R extends ClubSearchResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs/search/related';

  response!: R;

  params: {
    query: string;
  };

  constructor(query: string) {
    this.params = { query };
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

  constructor(
    public authorization: string,
    public data: NewClubData,
  ) {}
}

export class ClubDetail<R extends ClubDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
  ) {
    this.path = `/clubs/${clubId}`;
  }
}

export class PutClubInroduction<R extends ClubDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
    public data: ClubIntroductionData,
  ) {
    this.path = `/clubs/${clubId}/introduction`;
  }
}

export class PutClubLike<R extends PutClubLikeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
  ) {
    this.path = `/clubs/${clubId}/like`;
  }
}

export class DeleteClubLike<R extends DeleteClubLikeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/clubs';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number | string,
  ) {
    this.path = `/clubs/${clubId}/like/cancel`;
  }
}

export class PostClubQnA<R extends PostClubQnAResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/clubs';

  response!: R;

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

  response!: R;

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

  response!: R;

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
  ) {}
}

export class GetRecruitmentClub<R extends ClubRecruitmentResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  constructor(public clubId: string | number) {
    this.path = `/clubs/${clubId}/recruitment`;
  }
}

export class GetClubEventList<R extends ClubEventListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  constructor(
    public clubId: string | number,
    public eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED',
    public authorization?: string,
  ) {
    this.path = `/clubs/${clubId}/events?eventType=${eventType}`;
  }
}

export class GetClubEventDetail<R extends ClubEventResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/clubs';

  response!: R;

  constructor(
    public clubId: string | number,
    public eventId: string | number,
  ) {
    this.path = `/clubs/${clubId}/event/${eventId}`;
  }
}

export class PostClubRecruitment<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public data: ClubRecruitmentRequest,
  ) {
    this.path = `/clubs/${clubId}/recruitment`;
  }
}

export class PutClubRecruitment<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public data: ClubRecruitmentRequest,
  ) {
    this.path = `/clubs/${clubId}/recruitment`;
  }
}

export class DeleteClubRecruitment<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
  ) {
    this.path = `/clubs/${clubId}/recruitment`;
  }
}

export class PostClubEvent<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public data: ClubEventRequest,
  ) {
    this.path = `/clubs/${clubId}/event`;
  }
}

export class PutClubEvent<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public eventId: number,
    public data: ClubEventRequest,
  ) {
    this.path = `/clubs/${clubId}/event/${eventId}`;
  }
}

export class DeleteClubEvent<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public eventId: number,
  ) {
    this.path = `/clubs/${clubId}/event/${eventId}`;
  }
}

export class PostClubRecruitmentNotification<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
  ) {
    this.path = `/clubs/${clubId}/recruitment/notification`;
  }
}

export class DeleteClubRecruitmentNotification<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
  ) {
    this.path = `/clubs/${clubId}/recruitment/notification`;
  }
}

export class PostClubEventNotification<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public eventId: number,
  ) {
    this.path = `/clubs/${clubId}/event/${eventId}/notification`;
  }
}

export class DeleteClubEventNotification<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public clubId: number,
    public eventId: number,
  ) {
    this.path = `/clubs/${clubId}/event/${eventId}/notification`;
  }
}
