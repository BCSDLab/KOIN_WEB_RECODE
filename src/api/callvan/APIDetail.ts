import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { CallvanListRequest, CallvanListResponse, CallvanNotificationsResponse } from './entity';

export class GetCallvanList<R extends CallvanListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/callvan';

  params: CallvanListRequest;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    params: CallvanListRequest,
  ) {
    this.params = params;
  }
}

export class GetCallvanNotifications<R extends CallvanNotificationsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/callvan/notifications';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class PostMarkAllNotificationsRead<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/callvan/notifications/mark-all-read';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class PostMarkNotificationRead<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    notificationId: number,
  ) {
    this.path = `/callvan/notifications/${notificationId}/read`;
  }
}

export class DeleteAllNotifications<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/callvan/notifications';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}
