import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  Semester,
  SemestersResponse,
  LecturesResponse,
  SemesterCheckResponse,
  TimetableLectureInfoResponse,
  // EditTimetableLectureRequest,
  DeleteTimetableLectureResponse,
  TimetableFrameListResponse,
  EditTimetableFrameRequest,
  AddTimetableFrameRequest,
  TimetableFrameInfo,
  DeleteTimetableFrameResponse,
  DeleteSemesterResponse,
  VersionType,
  VersionInfoResponse,
  TimetableLectureRegularEditRequest,
  TimetableLectureCustomEditRequest,
  AddTimetableLectureRegularRequest,
  AddTimetableLectureCustomRequest,
} from './entity';

export class SemesterInfoList<R extends SemestersResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v3/semesters';

  response!: R;

  auth = false;
}

export class SemesterCheck<R extends SemesterCheckResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v3/semesters/check';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class LectureList<R extends LecturesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  constructor(semester: Semester) {
    this.path = `/v3/lectures?year=${semester.year}&term=${semester.term}`;
  }
}

export class TimetableLectureInfo
  <R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v3/timetables/lecture';

  response!: R;

  auth = true;

  params: {
    [index: string]: number;
  };

  constructor(public authorization: string, timeTableFrameId: number) {
    this.params = {
      timetable_frame_id: timeTableFrameId,
    };
  }
}

// v3
export class TimetableLectureRegularEdit
  <R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/lecture/regular';

  response!: R;

  auth = true;

  constructor(public data: TimetableLectureRegularEditRequest, public authorization: string) {}
}

export class TimetableLectureCustomEdit
  <R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/lecture/custom';

  response!: R;

  auth = true;

  constructor(public data: TimetableLectureCustomEditRequest, public authorization: string) {}
}

export class TimetableLectureRegularAddition
  <R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/v3/timetables/lecture/regular';

  response!: R;

  auth = true;

  constructor(public data: AddTimetableLectureRegularRequest, public authorization: string) {}
}

export class TimetableLectureCustomAddition
  <R extends TimetableLectureInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/v3/timetables/lecture/custom';

  response!: R;

  auth = true;

  constructor(public data: AddTimetableLectureCustomRequest, public authorization: string) {}
}

export class TimetableLectureDeletion
  <R extends DeleteTimetableLectureResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = '/v2/timetables/lecture/:id';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public id: number | undefined,
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

  constructor(public authorization: string, semester: string) {
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

  constructor(public data: AddTimetableFrameRequest, public authorization: string) {}
}

export class TimetableFrameEdit<R extends TimetableFrameInfo> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/frame/:id';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public id: number,
    public data: EditTimetableFrameRequest,
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

  constructor(public authorization: string, public id: number) {
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

  constructor(public authorization: string, semester: string) {
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
