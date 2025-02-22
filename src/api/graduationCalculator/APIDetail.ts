import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  GraduationAgree,
  GraduationExcelUploadResponse,
  GraduationExelUploadRequest,
} from './entity';

export class GraduationAgreement<R extends GraduationAgree> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/graduation/agree';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class GraduationExcelUpload<
  R extends GraduationExcelUploadResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/graduation/excel/upload';

  response!: R;

  auth = true;

  constructor(public data: GraduationExelUploadRequest, public authorization: string) {}
}
