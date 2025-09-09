import { useQuery } from '@tanstack/react-query';
import { graduationCalculator } from 'api';

const useGeneralEducation = (token: string) => {
  const { data } = useQuery(
    {
      queryKey: ['generalEducation'],
      queryFn: () => (graduationCalculator.getGeneralEducation(token)),
      enabled: !!token,
    },
  );

  return { generalEducation: data };
};

export default useGeneralEducation;
