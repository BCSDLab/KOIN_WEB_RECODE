import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  CourseResponse, BusResponse, BusTimetableResponse,
  Course, CityBusParams, CityInfoResponse, ShuttleCourseResponse,
  ShuttleTimetableDetailInfoResponse,
} from './entity';

export class CourseList<R extends CourseResponse> implements APIRequest<R> {
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

  constructor({ bus_type, direction, region }: Course) {
    this.path = `/bus/timetable/v2?bus_type=${bus_type}&direction=${direction}&region=${region}`;
  }
}

export class CityBusTimetableInfo<R extends CityInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor({ bus_number, direction }: CityBusParams) {
    this.path = `/bus/timetable/city?bus_number=${bus_number}&direction=${direction}`;
  }
}

export class ShuttleCourseInfo<R extends ShuttleCourseResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/courses/shuttle';

  response!: R;

  auth = false;
}

export class ShuttleTimetableDetailInfo<R extends ShuttleTimetableDetailInfoResponse>
implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor({ id }: { id: string }) {
    this.path = `/bus/timetable/shuttle/${id}`;
  }
}
