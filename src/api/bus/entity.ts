import { APIResponse } from 'interfaces/APIResponse';

export type BusType = 'shuttle' | 'express' | 'city';

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

export type BusTimetableResponse = BusRouteInfo | ExpressInfo;

export type CityInfoResponse = CityInfo;

export interface BusRouteInfo {
  bus_timetables: {
    route_name: string;
    arrival_info: ArrivalInfo[];
  }[],
  updated_at: string;
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
