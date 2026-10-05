import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { Semester } from './entity';
import { calculateGraduationCredits, getCourseType, getGeneralEducation } from './index';

export const graduationCalculatorQueryKeys = {
  all: ['graduation-calculator'] as const,
  creditsByCourseType: (isLoggedIn?: boolean) =>
    ['graduation-calculator', 'credits-by-course-type', getViewerScope(isLoggedIn)] as const,
  generalEducation: (isLoggedIn?: boolean) =>
    ['graduation-calculator', 'general-education', getViewerScope(isLoggedIn)] as const,
  courseType: (semester: Semester, name: string, generalEducationArea?: string, isLoggedIn?: boolean) =>
    [
      'graduation-calculator',
      'course-type',
      {
        year: semester.year,
        term: semester.term,
        name,
        generalEducationArea: generalEducationArea ?? '',
      },
      getViewerScope(isLoggedIn),
    ] as const,
};

export const graduationCalculatorQueries = {
  creditsByCourseType: (isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.creditsByCourseType(isLoggedIn),
      queryFn: () => calculateGraduationCredits(),
    }),

  generalEducation: (isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.generalEducation(isLoggedIn),
      queryFn: () => getGeneralEducation(),
    }),

  courseType: (semester: Semester, name: string, generalEducationArea?: string, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.courseType(semester, name, generalEducationArea, isLoggedIn),
      queryFn: () => getCourseType(semester, name, generalEducationArea),
    }),
};
