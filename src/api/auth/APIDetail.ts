import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  LoginRequest,
  LoginResponse,
  NicknameDuplicateCheckResponse,
  RefreshRequest,
  RefreshResponse,
  SignupResponse,
} from './entity';

export class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/login';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) {}
}

export class NicknameDuplicateCheck<R extends NicknameDuplicateCheckResponse>
implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(nickname: string) {
    this.path = `/user/check/nickname/${nickname}`;
  }
}

export class Signup<R extends SignupResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/register';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) {}
}

export class Refresh<R extends RefreshResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/refresh';

  response!: R;

  auth = false;

  constructor(public data: RefreshRequest) {}
}
