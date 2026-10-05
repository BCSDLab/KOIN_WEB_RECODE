import { queryOptions } from '@tanstack/react-query';
import { Semester } from './entity';
import { calculateGraduationCredits, getCourseType, getGeneralEducation } from './index';

export const graduationCalculatorQueryKeys = {
  all: ['graduation-calculator'] as const,
  creditsByCourseType: ['graduation-calculator', 'credits-by-course-type'] as const,
  generalEducation: ['graduation-calculator', 'general-education'] as const,
  courseType: (semester: Semester, name: string, generalEducationArea?: string) =>
    [
      'graduation-calculator',
      'course-type',
      {
        year: semester.year,
        term: semester.term,
        name,
        generalEducationArea: generalEducationArea ?? '',
      },
    ] as const,
};

export const graduationCalculatorQueries = {
  creditsByCourseType: (token: string) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.creditsByCourseType,
      queryFn: () => calculateGraduationCredits(token),
    }),

  generalEducation: (token: string) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.generalEducation,
      queryFn: () => getGeneralEducation(token),
    }),

  courseType: (token: string, semester: Semester, name: string, generalEducationArea?: string) =>
    queryOptions({
      queryKey: graduationCalculatorQueryKeys.courseType(semester, name, generalEducationArea),
      queryFn: () => getCourseType(token, semester, name, generalEducationArea),
    }),
};
