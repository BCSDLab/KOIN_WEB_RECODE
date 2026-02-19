import { useQuery } from '@tanstack/react-query';
import { getGeneralEducation } from 'api/graduationCalculator';

const useGeneralEducation = (token: string) => {
  const { data } = useQuery({
    queryKey: ['generalEducation'],
    queryFn: () => getGeneralEducation(token),
    enabled: !!token,
  });

  return { generalEducation: data };
};

export default useGeneralEducation;
