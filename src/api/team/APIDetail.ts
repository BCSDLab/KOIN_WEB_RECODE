import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import {
  MyCreatedTeamRecruitmentListRequest,
  MyCreatedTeamRecruitmentListResponse,
  MyTeamRecruitmentApplicationListRequest,
  MyTeamRecruitmentApplicationListResponse,
  TeamRecruitmentApplicantDetailResponse,
  TeamRecruitmentApplicantListRequest,
  TeamRecruitmentApplicantListResponse,
  TeamRecruitmentApplicationStatusUpdateRequest,
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

export class GetTeamRecruitmentApplicants<R extends TeamRecruitmentApplicantListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  params: TeamRecruitmentApplicantListRequest;

  constructor(
    public authorization: string,
    recruitmentId: string,
    params: TeamRecruitmentApplicantListRequest = {},
  ) {
    this.path = `/team-recruitments/${recruitmentId}/applications`;
    this.params = {
      ...(params.statuses?.length && { statuses: params.statuses }),
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

export class GetMyCreatedTeamRecruitments<R extends MyCreatedTeamRecruitmentListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/team-recruitments/me/created';

  response!: R;

  auth = true;

  params: MyCreatedTeamRecruitmentListRequest;

  constructor(
    public authorization: string,
    params: MyCreatedTeamRecruitmentListRequest = {},
  ) {
    this.params = {
      ...(params.status && { status: params.status }),
      ...(params.sort && { sort: params.sort }),
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };
  }
}

// 204 No Content — 요청 바디·응답 바디 모두 없음.
// PostTeamRecruitmentNotificationRead와 동일한 path-in-constructor 패턴을 따른다.
export class PutCloseTeamRecruitment<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    recruitmentId: number,
  ) {
    this.path = `/team-recruitments/${recruitmentId}/close`;
  }
}

export class GetTeamRecruitmentApplicantDetail<R extends TeamRecruitmentApplicantDetailResponse>
  implements APIRequest<R>
{
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    recruitmentId: string,
    applicationId: string,
  ) {
    this.path = `/team-recruitments/${recruitmentId}/applications/${applicationId}`;
  }
}

export class PutTeamRecruitmentApplicationStatus<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  data: TeamRecruitmentApplicationStatusUpdateRequest;

  constructor(
    public authorization: string,
    recruitmentId: string,
    applicationId: string,
    data: TeamRecruitmentApplicationStatusUpdateRequest,
  ) {
    this.path = `/team-recruitments/${recruitmentId}/applications/${applicationId}/status`;
    this.data = data;
  }
}
