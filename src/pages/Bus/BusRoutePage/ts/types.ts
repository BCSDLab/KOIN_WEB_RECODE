import { Arrival, BusTypeResponse, Depart } from 'api/bus/entity';

export type LocationDisplay = '코리아텍' | '천안역' | '천안터미널';

export interface Schedule {
  busType: BusTypeResponse;
  busName: string;
  departTime: string; // HH:mm:ss
}

export interface BusRoute {
  depart: Depart;
  arrival: Arrival;
  departDate: string; // yyyy-MM-dd
  departTime: string; // HH:mm:ss
  schedule: Schedule[];
}
