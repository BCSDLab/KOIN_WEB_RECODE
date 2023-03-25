import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  LectureInfoResponse,
  SemesterResponse,
  TimetableAddLectureRequest,
  TimetableAddLectureResponse,
  TimeTableInfoResponse,
  TimetableRemoveLectureResponse,
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
  method = HTTP_METHOD.POST;

  path = '/timetables';

  response!: R;

  auth = true;

  constructor(public data: TimetableAddLectureRequest, public authorization: string) { }
}

export class TimetableRemoveLecture<R extends TimetableRemoveLectureResponse>
implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/timetable';

  response!: R;

  auth = true;

  params: {
    [index: string]: string;
  };

  constructor(public authorization: string, id: string) {
    this.params = {
      id,
    };
  }
}

export class SemesterInfoList<R extends SemesterResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters';

  response!: R;

  auth = false;
}
