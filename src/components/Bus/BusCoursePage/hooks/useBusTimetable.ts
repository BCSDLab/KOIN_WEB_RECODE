import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getBusTimetableInfo, getCityBusTimetableInfo } from 'api/bus';
import {
  CityBusParams,
  CityInfo,
  ExpressCourse,
  ExpressInfo,
  ShuttleCourse,
} from 'api/bus/entity';
import useMount from 'utils/hooks/state/useMount';

const TIMETABLE_KEY = 'timetable';

interface CityTimetable {
  info: CityInfo;
  type: 'city';
}

export function useClientShuttleTimetable(course: ShuttleCourse) {
  const isMount = useMount();

  return useQuery({
    queryKey: ['timetable', 'shuttle', course.direction, course.region],
    queryFn: () => getBusTimetableInfo(course),
    enabled: isMount,
  });
}

export function useExpressTimetable(course: ExpressCourse) {
  const { bus_type, direction, region } = course;

  const { data } = useSuspenseQuery({
    queryKey: ['timetable', 'express', direction, region],
    queryFn: () =>
      getBusTimetableInfo({
        bus_type,
        direction,
        region,
      }),
    select: (response) => ({
      info: response as ExpressInfo,
      type: 'express' as const,
    }),
  });

  return data;
}

export function useCityBusTimetable(course: CityBusParams): CityTimetable {
  const { bus_number: busNumber, direction: busDirection } = course;

  const { data } = useSuspenseQuery({
    queryKey: [TIMETABLE_KEY, busNumber, busDirection] as const,
    queryFn: ({ queryKey: [, bus_number, direction] }) => getCityBusTimetableInfo({ bus_number, direction }),
    select: (response) => ({
      info: response as CityInfo,
      type: 'city' as const,
    }),
  });

  return data;
}
