import { APIResponse } from 'interfaces/APIResponse';

export type BusType = 'shuttle' | 'express' | 'city';

export type Direction = 'from' | 'to';

export type CoursesResponse = Array<{
  bus_type: 'shuttle' | 'commuting';
  direction: 'to' | 'from';
  region: string;
}>;

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

export type BusTimetableResponse = Array<BusRouteInfo>;

interface BusRouteInfo {
  route_name: string;
  arrival_info: {
    arrival_time: string;
    node_name: string;
  }[];
}
