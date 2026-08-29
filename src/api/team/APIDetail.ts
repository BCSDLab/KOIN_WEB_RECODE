import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import {
  TeamRecruitmentListRequest,
  TeamRecruitmentListResponse,
  TeamRecruitmentNotificationListRequest,
  TeamRecruitmentNotificationListResponse,
} from './entity';

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
