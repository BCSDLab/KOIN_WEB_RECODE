import { HTTP_METHOD, type APIRequest } from 'interfaces/APIRequest';
import type { CourseResponse, PreCourseResponse } from './entity';

export class CourseSearch<R extends CourseResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/course/registration/search';

  params: {
    name?: string;
    department?: string;
    year?: number;
    semester?: string;
  };

  response!: R;

  auth = false;

  constructor(name?: string, department?: string, year?: number, semester?: string) {
    this.params = {
      ...(name && { name }),
      ...(department && { department }),
      ...(year && { year }),
      ...(semester && { semester }),
    };
  }
}

export class PreCourseList<R extends PreCourseResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/course/registration/precourse';

  params: {
    timetable_frame_id: number;
  };

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    timetable_frame_id: number,
  ) {
    this.params = { timetable_frame_id };
  }
}
