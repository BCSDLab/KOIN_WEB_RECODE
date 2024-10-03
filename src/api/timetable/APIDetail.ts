import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  LectureInfoResponse,
  SemesterResponse,
  TimetableAddLectureRequest,
  TimetableAddLectureResponse,
  TimetableInfoResponse,
  TimetableRemoveLectureResponse,
  VersionInfoResponse,
  VersionType,
  SemesterCheckResponse,
  DeleteSemesterResponse,
  AddTimetableFrameRequest,
  UpdateTimetableFrameRequest,
  TimetableFrameListResponse,
  AddTimetableFrameResponse,
  DeleteTimetableFrameResponse,
  TimetableLectureInfoV2Response,
  AddTimetableLectureV2Request,
  UpdateTimetableLectureV2Request,
  TimetableLectureInfoV2AddResponse,
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

export class VersionInfo<R extends VersionInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'version/:type';

  constructor(type: VersionType) {
    this.path = `/version/${type}`;
  }
}

export class TimetableInfo<R extends TimetableInfoResponse> implements APIRequest<R> {
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
    [index: string]: number;
  };

  constructor(public authorization: string, id: number) {
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

export class SemesterCheck<R extends SemesterCheckResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/semesters/check';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
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

export class AddTimetableFrame<R extends AddTimetableFrameResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/v2/timetables/frame';

  response!: R;

  auth = true;

  constructor(public data: AddTimetableFrameRequest, public authorization: string) {}
}

export class UpdateTimetableFrame<R extends TimetableFrameListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/frame/:id';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public id: number,
    public data: UpdateTimetableFrameRequest,
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
export class TimetableLectureInfoV2
  <R extends TimetableLectureInfoV2AddResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v2/timetables/lecture';

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

export class AddTimetableLectureV2
  <R extends TimetableAddLectureResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/v2/timetables/lecture';

  response!: R;

  auth = true;

  constructor(public data: AddTimetableLectureV2Request, public authorization: string) {}
}

export class UpdateTimetableLectureV2
  <R extends TimetableLectureInfoV2Response> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/timetables/lecture';

  response!: R;

  auth = true;

  constructor(public data: UpdateTimetableLectureV2Request, public authorization: string) {}
}

export class DeleteTimetableLectureV2
  <R extends TimetableLectureInfoV2Response> implements APIRequest<R> {
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
