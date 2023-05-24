import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  DeptListResponse,
} from './entity';

export default class DeptList<R extends DeptListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/depts';

  response!: R;

  auth = false;
}
