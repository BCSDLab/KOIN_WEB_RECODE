import { queryOptions } from '@tanstack/react-query';
import { CourseRequestParams } from './entity';
import { getCourseSearch, getPreCourseList } from './index';

export const courseQueryKeys = {
  all: ['course'] as const,
  search: (params: CourseRequestParams) => [...courseQueryKeys.all, 'search', params] as const,
  preCourseList: (timetableFrameId: number) => [...courseQueryKeys.all, 'pre-course-list', timetableFrameId] as const,
};

export const courseQueries = {
  search: (params: CourseRequestParams) =>
    queryOptions({
      queryKey: courseQueryKeys.search(params),
      queryFn: () => getCourseSearch(params.name || undefined, params.department || undefined, params.year, params.semester),
    }),

  preCourseList: (token: string, timetableFrameId: number) =>
    queryOptions({
      queryKey: courseQueryKeys.preCourseList(timetableFrameId),
      queryFn: () => getPreCourseList(token, timetableFrameId),
      gcTime: 0,
    }),
};
