import { BusRouteInfoResponseDTO, ScheduleResponseDTO } from 'api/bus/entity';
import { BusRoute, Schedule } from 'components/Bus/BusRoutePage/ts/types';

export const transformSchedule = (dto: ScheduleResponseDTO): Schedule => ({
  busType: dto.bus_type,
  busName: dto.bus_name,
  departTime: dto.depart_time,
});

export const transformBusRoute = (dto: BusRouteInfoResponseDTO): BusRoute => ({
  depart: dto.depart,
  arrival: dto.arrival,
  departDate: dto.depart_date,
  departTime: dto.depart_time,
  schedule: dto.schedule.map(transformSchedule),
});
