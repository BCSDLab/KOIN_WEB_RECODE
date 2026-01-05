import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { DeptListResponse, DeptMajorResponse } from './entity';

export class DeptList<R extends DeptListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/depts';

  response!: R;

  auth = false;
}

export class DeptMajorList<R extends DeptMajorResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/depts/major';

  response!: R;

  auth = false;
}
