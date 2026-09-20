import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { Semester } from './entity';
import { calculateGraduationCredits, getCourseType, getGeneralEducation } from './index';

export const graduationCalculatorQueryKeys = {
  all: ['graduation-calculator'] as const,
  creditsByCourseType: (token?: string | null) =>
    ['graduation-calculator', 'credits-by-course-type', getViewerScope(token)] as const,
  generalEducation: (token?: string | null) =>
    ['graduation-calculator', 'general-education', getViewerScope(token)] as const,
  courseType: (semester: Semester, name: string, generalEducationArea?: string, token?: string | null) =>
    [
      'graduation-calculator',
      'course-type',
      {
        year: semester.year,
        term: semester.term,
        name,
        generalEducationArea: generalEducationArea ?? '',
      },
      getViewerScope(token),
    ] as const,
};

export const graduationCalculatorQueries = {
  creditsByCourseType: (token: string) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.creditsByCourseType(token),
      queryFn: () => calculateGraduationCredits(token),
    }),

  generalEducation: (token: string) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.generalEducation(token),
      queryFn: () => getGeneralEducation(token),
    }),

  courseType: (token: string, semester: Semester, name: string, generalEducationArea?: string) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.courseType(semester, name, generalEducationArea, token),
      queryFn: () => getCourseType(token, semester, name, generalEducationArea),
    }),
};
