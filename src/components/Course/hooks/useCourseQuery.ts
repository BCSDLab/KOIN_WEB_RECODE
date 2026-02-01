import { useSuspenseQuery } from '@tanstack/react-query';
import { getCourseSearch, getPreCourseList } from 'api/course';
import { CourseRequestParams } from 'api/course/entity';

export const useSuspenseCourseSearch = (params: CourseRequestParams) => {
  const { name, department, year, semester } = params;

  return useSuspenseQuery({
    queryKey: ['course', 'search', params],
    queryFn: () => getCourseSearch(name || undefined, department || undefined, year, semester),
  });
};

export const useSuspensePreCourseList = (token: string, timetableFrameId: number) => {
  return useSuspenseQuery({
    queryKey: ['course', 'pre-course-list', timetableFrameId],
    queryFn: () => getPreCourseList(token, timetableFrameId),
  });
};
