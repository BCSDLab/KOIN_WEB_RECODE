import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import {
  GraduationAgree,
  GeneralEducationResponse,
  Semester,
  CourseTypeResponse,
  GraduationExcelUploadResponse,
  GraduationExelUploadRequest,
  GradesByCourseTypeResponse,
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
    public semester: Semester,
    public name: string,
    public general_education_area: string | undefined,
  ) {
    this.path = `/graduation/course-type?year=${semester.year}&term=${semester.term}&name=${name}`
    + `${general_education_area ? `&general_education_area=${general_education_area}` : ''}`;
  }
}

export class GraduationExcelUpload<
  R extends GraduationExcelUploadResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/graduation/excel/upload';

  response!: R;

  auth = true;

  constructor(public data: GraduationExelUploadRequest, public authorization: string) {}
}

export class GradesByCourseType<R extends GradesByCourseTypeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'graduation/course/calculation';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}
