import { useSuspenseQuery } from '@tanstack/react-query';
import { graduationCalculator } from 'api';
import { Semester } from 'api/graduationCalculator/entity';

const useCourseType = (token: string, semester: Semester, name: string, generalEducationArea?: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ['courseType', semester, name, generalEducationArea],
    queryFn: () => graduationCalculator.getCourseType(token, semester, name, generalEducationArea),
  });

  return { data };
};

export default useCourseType;
