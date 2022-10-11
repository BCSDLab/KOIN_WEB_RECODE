import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import {
  LectureInfoResponse,
  SemesterResponse,
} from './entity';

export class LectureList<R extends LectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/lectures';

  response!: R;

  params: {
    [index: string]: string;
  };

  auth = false;

  constructor(semester_date: string) {
    this.params = {
      semester_date,
    };
  }
}

export class SemesterInfoList<R extends SemesterResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters';

  response!: R;

  auth = false;
}
