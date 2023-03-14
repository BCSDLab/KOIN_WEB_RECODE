import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { LectureInfo } from 'interfaces/Lecture';
import {
  LectureInfoResponse,
  SemesterResponse,
  TimetableAddLectureRequest,
  TimetableAddLectureResponse,
  TimeTableInfoResponse,
} from './entity';

export class LectureList<R extends LectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/lectures';

  response!: R;

  params: {
    [index: string]: string;
  };

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

  constructor(public authorization: string, semester: string) {
    this.params = {
      semester,
    };
  }
}
export class TimetableAddLecture<R extends TimetableAddLectureResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/timetables';

  response!: R;

  auth = true;

  constructor(public authorization: string, public data: TimetableAddLectureRequest) { }
}

export class SemesterInfoList<R extends SemesterResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters';

  response!: R;

  auth = false;
}
