import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import {
  GraduationAgree,
  GeneralEducationResponse,
  CourseTypeRequest,
  CourseTypeResponse,
} from './entity';

export class GraduationAgreement<R extends GraduationAgree> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/graduation/agree';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class GeneralEducation<R extends GeneralEducationResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/graduation/lecture/general-education';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class CourseType<R extends CourseTypeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public data: CourseTypeRequest,
  ) {
    this.path = `/graduation/course-type?year=${data.year}&term=${data.term}&name=${data.name}`;
  }
}
