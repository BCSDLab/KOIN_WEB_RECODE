import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  LoginRequest,
  LoginResponse,
  NicknameDuplicateCheckResponse,
  RefreshRequest,
  RefreshResponse,
  SignupResponse,
  UserResponse,
  FindPasswordRequest,
  FindPasswordResponse,
  UserUpdateRequest,
  DeleteResponse,
  CheckPasswordResponse,
} from './entity';

export class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/login';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) { }
}

export class NicknameDuplicateCheck<R extends NicknameDuplicateCheckResponse> implements
  APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(nickname: string) {
    this.path = `/user/check/nickname?nickname=${nickname}`;
  }
}

export class Signup<R extends SignupResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/student/register';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) { }
}

export class Refresh<R extends RefreshResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/refresh';

  response!: R;

  auth = false;

  constructor(public data: RefreshRequest) { }
}

export class User<R extends UserResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/user/student/me';

  response!: R;

  auth = false;

  constructor(public authorization: string) { }
}

export class UpdateUser<R extends UserResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/user/student/me';

  response!: R;

  data: UserUpdateRequest;

  auth = true;

  constructor(public authorization: string, data: UserUpdateRequest) {
    this.data = data;
  }
}

export class DeleteUser<R extends DeleteResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  response!: R;

  path = '/user';

  auth = true;

  constructor(public authorization: string) { }
}

export class FindPassword<R extends FindPasswordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/find/password';

  response!: R;

  auth = false;

  constructor(public data: FindPasswordRequest) { }
}

export class CheckPassword<R extends CheckPasswordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/check/password';

  response!: R;

  auth = true;

  constructor(public data: { password: string }) { }
}
