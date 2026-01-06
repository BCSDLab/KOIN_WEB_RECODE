import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  CourseResponse,
  BusResponse,
  BusTimetableResponse,
  Course,
  CityBusParams,
  CityInfoResponse,
  BusRouteInfoResponseDTO,
  BusRouteParams,
  BusNoticeInfoResponse,
  ShuttleCourseResponse,
  ShuttleTimetableDetailInfoResponse,
  BusTypeRequest,
  Depart,
  Arrival,
} from './entity';

export class CourseList<R extends CourseResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/courses';

  response!: R;

  auth = false;
}

export class BusInfo<R extends BusResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus';

  params: { bus_type: string; depart: string; arrival: string };

  response!: R;

  auth = false;

  constructor(type: string, depart: string, arrival: string) {
    this.params = { bus_type: type, depart, arrival };
  }
}

export class BusTimetableInfo<R extends BusTimetableResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/timetable/v2';

  params: { bus_type: string; direction: string; region: string };

  response!: R;

  auth = false;

  constructor({ bus_type, direction, region }: Course) {
    this.params = { bus_type, direction, region };
  }
}

export class CityBusTimetableInfo<R extends CityInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/timetable/city';

  params: { bus_number: number; direction: string };

  response!: R;

  auth = false;

  constructor({ bus_number, direction }: CityBusParams) {
    this.params = { bus_number, direction };
  }
}

export class ShuttleCourseInfo<R extends ShuttleCourseResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/courses/shuttle';

  response!: R;

  auth = false;
}

export class ShuttleTimetableDetailInfo<R extends ShuttleTimetableDetailInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor({ id }: { id: string }) {
    this.path = `/bus/timetable/shuttle/${id}`;
  }
}

export class BusRouteInfo<R extends BusRouteInfoResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/route';

  params: { date: string; time: string; busType: BusTypeRequest; depart?: Depart; arrival?: Arrival };

  response!: R;

  auth = false;

  constructor({ dayOfMonth: date, time, busType, depart, arrival }: BusRouteParams) {
    this.params = { date, time, busType, depart, arrival };
  }
}

export class BusNoticeInfo<R extends BusNoticeInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/bus/notice';

  response!: R;

  auth = false;
}
