import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  SemesterResponse,
  LectureInfoResponse,
  SemesterCheckResponse,
  TimetableLectureInfoResponse,
  EditTimetableLectureRequest,
  AddTimetableLectureRequest,
  DeleteTimetableLectureResponse,
  TimetableFrameListResponse,
  EditTimetableFrameRequest,
  AddTimetableFrameRequest,
  TimetableFrameInfo,
  DeleteTimetableFrameResponse,
  DeleteSemesterResponse,
  VersionType,
  VersionInfoResponse,
} from './entity';

export class SemesterInfoList<R extends SemesterResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters';

  response!: R;

  auth = false;
}

export class SemesterCheck<R extends SemesterCheckResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters/check';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

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

export class TimetableLectureInfo<R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v2/timetables/lecture';

  response!: R;

  auth = true;

  params: {
    [index: string]: number;
  };

  constructor(
    public authorization: string,
    timeTableFrameId: number
  ) {
    this.params = {
      timetable_frame_id: timeTableFrameId,
    };
  }
}

export class TimetableLectureEdit<R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/lecture';

  response!: R;

  auth = true;

  constructor(
    public data: EditTimetableLectureRequest,
    public authorization: string
  ) {}
}

export class TimetableLectureAddition<R extends TimetableLectureInfoResponse>
  implements APIRequest<R>
{
  method = HTTP_METHOD.POST;

  path = '/v2/timetables/lecture';

  response!: R;

  auth = true;

  constructor(
    public data: AddTimetableLectureRequest,
    public authorization: string
  ) {}
}

export class TimetableLectureDeletion<R extends DeleteTimetableLectureResponse>
  implements APIRequest<R>
{
  method = HTTP_METHOD.DELETE;

  path = '/v2/timetables/lecture/:id';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public id: number | undefined
  ) {
    this.path = `/v2/timetables/lecture/${id}`;
  }
}

export class TimetableFrameList<R extends TimetableFrameListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v2/timetables/frames';

  response!: R;

  auth = true;

  params: {
    [index: string]: string;
  };

  constructor(
    public authorization: string,
    semester: string
  ) {
    this.params = {
      semester,
    };
  }
}

export class TimetableFrameAddition<R extends TimetableFrameInfo> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/v2/timetables/frame';

  response!: R;

  auth = true;

  constructor(
    public data: AddTimetableFrameRequest,
    public authorization: string
  ) {}
}

export class TimetableFrameEdit<R extends TimetableFrameInfo> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/frame/:id';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public id: number,
    public data: EditTimetableFrameRequest
  ) {
    this.path = `/v2/timetables/frame/${id}`;
    this.data = data;
  }
}

export class DeleteTimetableFrame<R extends DeleteTimetableFrameResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/v2/timetables/frame';

  response!: R;

  auth = true;

  params: {
    [index: string]: number;
  };

  constructor(
    public authorization: string,
    public id: number
  ) {
    this.params = {
      id,
    };
  }
}

export class DeleteSemester<R extends DeleteSemesterResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/v2/all/timetables/frame';

  response!: R;

  auth = true;

  params: {
    [index: string]: string;
  };

  constructor(
    public authorization: string,
    semester: string
  ) {
    this.params = {
      semester,
    };
  }
}

export class VersionInfo<R extends VersionInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'versions/:type';

  constructor(type: VersionType) {
    this.path = `/version/${type}`;
  }
}
