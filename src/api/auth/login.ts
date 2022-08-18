import { APIRequest } from '../interfaces/APIRequest';
import { HTTPMethod } from '../apiClient';
import { LoginRequest, LoginResponse } from './entity';

export default class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTPMethod.POST;

  path = '/user/login/';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) {}
}
