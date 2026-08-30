import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import {
  MyTeamRecruitmentApplicationListRequest,
  MyTeamRecruitmentApplicationListResponse,
  TeamRecruitmentDetailResponse,
  TeamRecruitmentListRequest,
  TeamRecruitmentListResponse,
  TeamRecruitmentNotificationListRequest,
  TeamRecruitmentNotificationListResponse,
  TeamRecruitmentUpdateRequest,
} from './entity';

export class GetTeamRecruitmentDetail<R extends TeamRecruitmentDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(
    public authorization: string | undefined,
    recruitmentId: number,
  ) {
    this.path = `/team-recruitments/${recruitmentId}`;
  }
}

export class DeleteTeamRecruitment<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    recruitmentId: number,
  ) {
    this.path = `/team-recruitments/${recruitmentId}`;
  }
}

export class PutTeamRecruitment<R extends TeamRecruitmentDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    recruitmentId: number,
    public data: TeamRecruitmentUpdateRequest,
  ) {
    this.path = `/team-recruitments/${recruitmentId}`;
  }
}

export class GetTeamRecruitmentList<R extends TeamRecruitmentListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/team-recruitments';

  response!: R;

  auth = false;

  params: TeamRecruitmentListRequest;

  constructor(
    public authorization?: string,
    params: TeamRecruitmentListRequest = {},
  ) {
    const keyword = params.keyword?.trim();

    this.params = {
      ...(keyword && { keyword }),
      ...(params.status && { status: params.status }),
      ...(params.categories?.length && { categories: params.categories }),
      ...(params.meetingType && { meetingType: params.meetingType }),
      ...(params.sort && { sort: params.sort }),
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };
  }
}

export class GetTeamRecruitmentNotifications<R extends TeamRecruitmentNotificationListResponse>
  implements APIRequest<R>
{
  method = HTTP_METHOD.GET;

  path = '/team-recruitments/notifications';

  response!: R;

  auth = true;

  params: TeamRecruitmentNotificationListRequest;

  constructor(
    public authorization: string,
    params: TeamRecruitmentNotificationListRequest = {},
  ) {
    this.params = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };
  }
}

export class GetMyTeamRecruitmentApplications<R extends MyTeamRecruitmentApplicationListResponse>
  implements APIRequest<R>
{
  method = HTTP_METHOD.GET;

  path = '/team-recruitments/me/applications';

  response!: R;

  auth = true;

  params: MyTeamRecruitmentApplicationListRequest;

  constructor(
    public authorization: string,
    params: MyTeamRecruitmentApplicationListRequest = {},
  ) {
    this.params = {
      ...(params.statuses?.length && { statuses: params.statuses }),
      ...(params.sort && { sort: params.sort }),
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };
  }
}

export class PostTeamRecruitmentNotificationRead<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    notificationId: number,
  ) {
    this.path = `/team-recruitments/notifications/${notificationId}/read`;
  }
}

export class PostTeamRecruitmentNotificationsMarkAllRead<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/team-recruitments/notifications/mark-all-read';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class DeleteTeamRecruitmentNotifications<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/team-recruitments/notifications';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}
