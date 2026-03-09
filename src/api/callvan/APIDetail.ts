import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  CallvanChatResponse,
  CallvanListRequest,
  CallvanListResponse,
  CallvanNotificationsResponse,
  CallvanPostDetail,
  CreateCallvanRequest,
  CreateCallvanResponse,
  SendChatRequest,
} from './entity';

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

export class PostCallvan<R extends CreateCallvanResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/callvan';

  data: CreateCallvanRequest;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    data: CreateCallvanRequest,
  ) {
    this.data = data;
  }
}

export class DeleteAllNotifications<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/callvan/notifications';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class GetCallvanPostDetail<R extends CallvanPostDetail> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}`;
  }
}

export class PostJoinCallvan<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}/participants`;
  }
}

export class DeleteCancelCallvan<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}/participants`;
  }
}

export class GetCallvanChat<R extends CallvanChatResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}/chat`;
  }
}

export class PostCallvanChat<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  data: SendChatRequest;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
    data: SendChatRequest,
  ) {
    this.path = `/callvan/posts/${postId}/chat`;
    this.data = data;
  }
}

export class PutCloseCallvanPost<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}/close`;
  }
}

export class PutReopenCallvanPost<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}/reopen`;
  }
}

export class PutCompleteCallvanPost<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    postId: number,
  ) {
    this.path = `/callvan/posts/${postId}/complete`;
  }
}
