import { queryOptions, skipToken } from '@tanstack/react-query';
import {
  BusRouteParams,
  CityBusParams,
  Depart,
  Arrival,
  ExpressCourse,
  ShuttleCourse,
} from './entity';
import {
  getBusNoticeInfo,
  getBusRouteInfo,
  getBusTimetableInfo,
  getCityBusTimetableInfo,
  getShuttleCourseInfo,
  getShuttleTimetableDetailInfo,
} from './index';

export interface BusRouteQueryParams extends Omit<BusRouteParams, 'depart' | 'arrival'> {
  depart: Depart | '';
  arrival: Arrival | '';
}

export const busQueryKeys = {
  all: ['bus'] as const,
  notice: () => [...busQueryKeys.all, 'notice'] as const,
  shuttleCourse: () => [...busQueryKeys.all, 'courses', 'shuttle'] as const,
  timetable: ['bus', 'timetable'] as const,
  shuttleTimetable: (course: ShuttleCourse) =>
    [...busQueryKeys.timetable, 'shuttle', course.bus_type, course.direction, course.region] as const,
  expressTimetable: (course: ExpressCourse) =>
    [...busQueryKeys.timetable, 'express', course.bus_type, course.direction, course.region] as const,
  cityTimetable: (course: CityBusParams) =>
    [...busQueryKeys.timetable, 'city', course.bus_number, course.direction] as const,
  shuttleTimetableDetail: (id: string | null) => [...busQueryKeys.all, 'shuttle', 'timetable', id] as const,
  route: (params: BusRouteQueryParams) => [...busQueryKeys.all, 'route', JSON.stringify(params)] as const,
};

export const busQueries = {
  notice: () =>
    queryOptions({
      queryKey: busQueryKeys.notice(),
      queryFn: getBusNoticeInfo,
    }),

  shuttleCourse: () =>
    queryOptions({
      queryKey: busQueryKeys.shuttleCourse(),
      queryFn: getShuttleCourseInfo,
    }),

  shuttleTimetable: (course: ShuttleCourse) =>
    queryOptions({
      queryKey: busQueryKeys.shuttleTimetable(course),
      queryFn: () => getBusTimetableInfo(course),
    }),

  expressTimetable: (course: ExpressCourse) =>
    queryOptions({
      queryKey: busQueryKeys.expressTimetable(course),
      queryFn: () => getBusTimetableInfo(course),
    }),

  cityTimetable: (course: CityBusParams) =>
    queryOptions({
      queryKey: busQueryKeys.cityTimetable(course),
      queryFn: () => getCityBusTimetableInfo(course),
    }),

  shuttleTimetableDetail: (id: string | null) =>
    queryOptions({
      queryKey: busQueryKeys.shuttleTimetableDetail(id),
      queryFn: id ? () => getShuttleTimetableDetailInfo({ id }) : skipToken,
    }),

  route: (params: BusRouteQueryParams) => {
    const { depart, arrival, ...rest } = params;

    return queryOptions({
      queryKey: busQueryKeys.route(params),
      queryFn:
        depart && arrival
          ? () =>
              getBusRouteInfo({
                ...rest,
                depart: depart as Depart,
                arrival: arrival as Arrival,
              })
          : skipToken,
    });
  },
};
