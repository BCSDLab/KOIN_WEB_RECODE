import { useSuspenseQuery } from '@tanstack/react-query';
import { getCourseType } from 'api/graduationCalculator';
import { Semester } from 'api/graduationCalculator/entity';

const useCourseType = (token: string, semester: Semester, name: string, generalEducationArea?: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ['courseType', semester, name, generalEducationArea],
    queryFn: () => getCourseType(token, semester, name, generalEducationArea),
  });

  return { data };
};

export default useCourseType;
