import { dept } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

const useDeptList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['dept'],
    queryFn: dept.default,
  });

  return { data };
};

export default useDeptList;
