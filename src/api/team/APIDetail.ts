import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import {
  MyCreatedTeamRecruitmentListRequest,
  MyCreatedTeamRecruitmentListResponse,
  MyTeamRecruitmentApplicationListRequest,
  MyTeamRecruitmentApplicationListResponse,
  TeamRecruitmentDetailResponse,
  TeamChatDirectRoomResponse,
  TeamChatMessage,
  TeamChatMessageListRequest,
  TeamChatMessageListResponse,
  TeamChatMessageSendRequest,
  TeamChatRoomResponse,
  TeamRecruitmentApplicantListRequest,
  TeamRecruitmentApplicantListResponse,
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

const TEAM_CHAT_MESSAGE_DEFAULT_LIMIT = 100;

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

export class GetTeamRecruitmentNotifications<
  R extends TeamRecruitmentNotificationListResponse,
> implements APIRequest<R> {
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

export class GetMyTeamRecruitmentApplications<
  R extends MyTeamRecruitmentApplicationListResponse,
> implements APIRequest<R> {
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

export class GetTeamRecruitmentChatRoom<R extends TeamChatRoomResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    recruitmentId: number,
    chatRoomId: number,
  ) {
    this.path = `/chatroom/team-recruitment/${recruitmentId}/${chatRoomId}`;
  }
}

export class GetTeamRecruitmentChatMessages<R extends TeamChatMessageListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  params: TeamChatMessageListRequest;

  constructor(
    public authorization: string,
    recruitmentId: number,
    chatRoomId: number,
    params: TeamChatMessageListRequest = {},
  ) {
    this.path = `/chatroom/team-recruitment/${recruitmentId}/${chatRoomId}/messages`;

    this.params = {
      ...(params.afterMessageId && { afterMessageId: params.afterMessageId }),
      ...(params.beforeMessageId && { beforeMessageId: params.beforeMessageId }),
      limit: params.limit ?? TEAM_CHAT_MESSAGE_DEFAULT_LIMIT,
    };
  }
}

export class PostTeamRecruitmentChatMessage<R extends TeamChatMessage> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  data: TeamChatMessageSendRequest;

  constructor(
    public authorization: string,
    recruitmentId: number,
    chatRoomId: number,
    data: TeamChatMessageSendRequest,
  ) {
    this.path = `/chatroom/team-recruitment/${recruitmentId}/${chatRoomId}/messages`;
    this.data = data;
  }
}

export class PostTeamRecruitmentDirectChatRoom<R extends TeamChatDirectRoomResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    recruitmentId: number,
    applicationId: number,
  ) {
    this.path = `/chatroom/team-recruitment/${recruitmentId}/applications/${applicationId}/direct`;
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
