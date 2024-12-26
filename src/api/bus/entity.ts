import { APIResponse } from 'interfaces/APIResponse';

export type BusType = 'shuttle' | 'express' | 'city';
export type BusTypeResponse = BusType;
export type BusTypeRequest = 'CITY' | 'EXPRESS' | 'SHUTTLE' | 'ALL';

export type DepartArrivalPlace = 'KOREATECH' | 'STATION' | 'TERMINAL';
export type Depart = DepartArrivalPlace;
export type Arrival = DepartArrivalPlace;

export type Direction = 'from' | 'to';

export type CourseBusType = 'shuttle' | 'commuting' | 'express';

export interface ShuttleCourse extends Course {
  bus_type: 'shuttle' | 'commuting';
}

export interface ExpressCourse extends Course {
  bus_type: 'express';
}

export interface Course {
  bus_type: CourseBusType;
  direction: Direction;
  region: string;
}

export interface CityBusParams {
  bus_number: number;
  direction: string;
}

export type CourseResponse = Course[];

export interface BusResponse extends APIResponse {
  bus_type: BusType;
  next_bus: {
    remain_time: number;
    bus_number?: number;
  } | null;
  now_bus: {
    remain_time: number;
    bus_number?: number;
  } | null;
}

export type BusTimetableResponse = RouteInfo | ExpressInfo;

export type CityInfoResponse = CityInfo;

export interface RouteInfo {
  bus_timetables: {
    route_name: string;
    arrival_info: ArrivalInfo[];
  }[],
  updated_at: string;
}

export interface ScheduleResponseDTO {
  bus_type: BusTypeResponse;
  bus_name: string;
  depart_time: string; // HH:mm:ss
}

export interface BusRouteInfoResponseDTO {
  depart: Depart;
  arrival: Arrival;
  depart_date: string; // yyyy-MM-dd
  depart_time: string; // HH:mm:ss
  schedule: ScheduleResponseDTO[];
}

export interface ArrivalInfo {
  arrival_time: string;
  node_name: string;
}

export interface ExpressInfo {
  bus_timetables: {
    departure: string;
    arrival: string;
    charge: number;
  }[];
  updated_at: string;
}

export interface CityInfo {
  updated_at: string;
  bus_info: {
    number: number;
    depart_node: string;
    arrival_node: string;
  };
  bus_timetables: {
    day_of_week: string;
    depart_info: [];
  }[];
}

export interface ShuttleCourseResponse {
  route_regions: {
    region: string;
    routes: {
      id: string;
      type: string;
      route_name: string;
      sub_name: string;
    }[];
  }[];

  semester_info: {
    name: string;
    from: string;
    to: string;
  }
}

export interface ShuttleTimetableDetailInfoResponse {
  id: string,
  region: string,
  route_type: string,
  route_name: string,
  sub_name: null,
  node_info: {
    name: string,
    detail: string,
  }[],
  route_info: {
    name: string,
    detail: string,
    arrival_time: string[],
  }[],
}

export interface BusRouteParams {
  dayOfMonth: string; // yyyy-MM-dd
  time: string; // HH:mm
  busType: BusTypeRequest;
  depart?: Depart;
  arrival?: Arrival;
}

export interface BusNoticeInfoResponse {
  id: number;
  title: string;
}
