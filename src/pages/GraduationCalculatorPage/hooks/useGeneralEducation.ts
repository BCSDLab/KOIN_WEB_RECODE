import { useSuspenseQuery } from '@tanstack/react-query';
import { graduationCalculator } from 'api';

const useGeneralEducation = (token: string) => {
  const { data } = useSuspenseQuery(
    {
      queryKey: ['generalEducation'],
      queryFn: () => (graduationCalculator.getGeneralEducation(token)),
    },
  );

  return { generalEducation: data };
};

export default useGeneralEducation;
