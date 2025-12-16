import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getBusTimetableInfo, getCityBusTimetableInfo } from 'api/bus';
import {
  CityBusParams,
  CityInfo,
  ExpressCourse,
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
  return useQuery({
    queryKey: ['timetable', 'express', course.direction, course.region],
    queryFn: () =>
      getBusTimetableInfo({
        bus_type: course.bus_type,
        direction: course.direction,
        region: course.region,
      }),
    staleTime: 1000 * 60 * 5,
  });
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
