import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import {
  CoursesResponse, BusResponse, BusTimetableResponse, Direction, BusType,
} from './entity';

export class CourseList<R extends CoursesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/courses';

  response!: R;

  auth = false;
}

export class BusInfo<R extends BusResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(type: string, depart: string, arrival: string) {
    this.path = `/bus?bus_type=${type}&depart=${depart}&arrival=${arrival}`;
  }
}

export class BusTimetableInfo<R extends BusTimetableResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(bus_type: BusType, direction: Direction, region: string) {
    this.path = `/bus/timetable?bus_type=${bus_type}&direction=${direction}&region=${region}`;
  }
}
