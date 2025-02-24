import { useSuspenseQuery } from '@tanstack/react-query';
// import { graduationCalculator } from 'api';

const useCourseType = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['courseType'],
    // queryFn: graduationCalculator.getCourseType,
  });

  return { data };
};

export default useCourseType;
