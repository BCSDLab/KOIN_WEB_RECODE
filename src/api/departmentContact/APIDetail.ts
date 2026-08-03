import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  DepartmentCategoryContactsRequest,
  DepartmentCategoryContactsResponse,
  DepartmentContactCategory,
  DepartmentContactsRequest,
  DepartmentContactsResponse,
} from './entity';

export class GetDepartmentContacts<R extends DepartmentContactsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/department-contacts';

  params: DepartmentContactsRequest;

  response!: R;

  auth = false;

  constructor(params: DepartmentContactsRequest = {}) {
    this.params = params;
  }
}

export class GetDepartmentContactsByCategory<R extends DepartmentCategoryContactsResponse>
implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  params: DepartmentCategoryContactsRequest;

  response!: R;

  auth = false;

  constructor(category: DepartmentContactCategory, params: DepartmentCategoryContactsRequest = {}) {
    this.path = `/department-contacts/${category}`;
    this.params = params;
  }
}
