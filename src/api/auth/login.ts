import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { LoginRequest, LoginResponse } from './entity';

export default class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/login';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) {}
}
