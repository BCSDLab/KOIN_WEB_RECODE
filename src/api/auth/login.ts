import { APIRequest } from '../interfaces/APIRequest';
import { HTTPMethod } from '../apiClient';
import { LoginRequest, LoginResponse } from './entity';

export class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTPMethod.POST;

  path = '/user/login';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) {}
}

export class Refresh<R extends LoginResponse> implements APIRequest<R> {
  method = HTTPMethod.GET;

  path = '/user/refresh';

  response!: R;

  auth = false;
}
