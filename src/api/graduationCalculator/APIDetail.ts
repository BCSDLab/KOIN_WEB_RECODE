import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  GraduationAgree,
} from './entity';

export class GraduationAgreement<R extends GraduationAgree> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/graduation/agree';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}
