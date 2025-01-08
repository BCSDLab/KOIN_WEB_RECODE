import { getBusTimetableInfo, getCityBusTimetableInfo } from 'api/bus';
import {
  BusRouteInfo as ShuttleInfo,
  CityBusParams,
  CityInfo,
  Course,
  ExpressCourse,
  ExpressInfo,
  ShuttleCourse,
} from 'api/bus/entity';
import { useSuspenseQuery } from '@tanstack/react-query';

const TIMETABLE_KEY = 'timetable';

interface ShuttleTimetable {
  info: ShuttleInfo;
  type: 'shuttle';
}

interface ExpressTimetable {
  info: ExpressInfo;
  type: 'express';
}

interface CityTimetable {
  info: CityInfo;
  type: 'city';
}

function useBusTimetable(course: ShuttleCourse): ShuttleTimetable;

function useBusTimetable(course: ExpressCourse): ExpressTimetable;

function useBusTimetable(course: Course): ShuttleTimetable | ExpressTimetable | undefined {
  const { bus_type: busType, direction: busDirection, region: busRegion } = course;

  const { data } = useSuspenseQuery({
    queryKey: [TIMETABLE_KEY, busType, busDirection, busRegion] as const,
    queryFn: ({ queryKey: [, bus_type, direction, region] }) =>
      getBusTimetableInfo({ bus_type, direction, region }),
    select: (response) => {
      if (busType === 'express') {
        return {
          info: response as ExpressInfo,
          type: 'express' as const,
        };
      }

      return {
        info: response as ShuttleInfo,
        type: 'shuttle' as const,
      };
    },
  });

  return data;
}

export function useCityBusTimetable(course: CityBusParams): CityTimetable {
  const { bus_number: busNumber, direction: busDirection } = course;

  const { data } = useSuspenseQuery({
    queryKey: [TIMETABLE_KEY, busNumber, busDirection] as const,
    queryFn: ({ queryKey: [, bus_number, direction] }) =>
      getCityBusTimetableInfo({ bus_number, direction }),
    select: (response) => ({
      info: response as CityInfo,
      type: 'city' as const,
    }),
  });

  return data;
}

export default useBusTimetable;
