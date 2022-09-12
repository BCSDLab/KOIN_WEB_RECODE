import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import {
  DeptListResponse,
} from './entity';

export default class DeptList<R extends DeptListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/depts';

  response!: R;

  auth = false;
}
