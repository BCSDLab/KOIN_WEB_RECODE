import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  LectureInfoResponse,
  SemesterResponse,
  TimeTableInfoResponse,
} from './entity';

export class LectureList<R extends LectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/lectures';

  response!: R;

  params: {
    [index: string]: string;
  };

  auth = true;

  constructor(semester_date: string) {
    this.params = {
      semester_date,
    };
  }
}

export class TimetableInfo<R extends TimeTableInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/timetables';

  response!: R;

  params: {
    [index: string]: string;
  };

  auth = true;

  authorization: string;

  constructor(authorization: string, semester: string) {
    this.params = {
      semester,
    };
    this.authorization = authorization;
  }
}

export class SemesterInfoList<R extends SemesterResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters';

  response!: R;

  auth = false;
}
